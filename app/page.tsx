'use client';

import { useState, useRef, useEffect } from 'react';
import { SchnauzerAvatar } from '@/components/schnauzer-avatar';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useScheduler } from '@/hooks/use-scheduler';
import { registerServiceWorker } from '@/lib/register-sw';
import { SettingsDialog, type AppSettings } from '@/components/settings-dialog';
import { Mic, MicOff, Moon } from 'lucide-react';

type AppState = 'idle' | 'listening' | 'processing' | 'speaking';

const DEFAULT_SETTINGS: AppSettings = {
  petName: 'Picha',
  schedules: [
    { hour: 10, minute: 0, instruction: 'Hola, ¿cómo te sentís hoy? ¿Querés contarme algo lindo?' },
    { hour: 13, minute: 0, instruction: '¿Te acordás del nombre de tu mamá? Me encantaría que me cuentes algo de ella.' },
    { hour: 16, minute: 0, instruction: 'Vamos a jugar un poco. Decime: una flor, un color y un animal. Después los repetimos juntos.' },
    { hour: 19, minute: 0, instruction: '¿Preferís tomar té o café? Contame cuál te gusta más.' },
    { hour: 21, minute: 0, instruction: '¿Sabés qué día es hoy? No importa si no te acordás, estoy acá para acompañarte.' },
  ],
};

export default function Page() {
  const [state, setState] = useState<AppState>('idle');
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [statusText, setStatusText] = useState(`Hola, soy ${DEFAULT_SETTINGS.petName}`);
  const [restMode, setRestMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recordingStartTimeRef = useRef<number>(0);

  // Scheduler para mensajes automáticos
  useScheduler({
    enabled: !restMode,
    schedules: settings.schedules,
    onScheduledMessage: async (instruction: string) => {
      await handleScheduledMessage(instruction);
    },
  });

  // Cargar settings desde localStorage al montar (client-only)
  useEffect(() => {
    const saved = localStorage.getItem('appSettings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as AppSettings;
        setSettings(parsed);
        setStatusText(`Hola, soy ${parsed.petName}`);
      } catch (error) {
        console.error('[v0] Error cargando configuración:', error);
      }
    }
  }, []);

  // Registrar service worker y solicitar permisos
  useEffect(() => {
    registerServiceWorker();

    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const handleSettingsChange = (newSettings: AppSettings) => {
    setSettings(newSettings);
    setStatusText(`Hola, soy ${newSettings.petName}`);
  };

  const handleScheduledMessage = async (message: string) => {
    try {
      setState('speaking');
      setStatusText('Estoy hablando...');

      // Obtener respuesta del chat
      const chatResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          context: 'Mensaje automático programado',
        }),
      });

      const { response } = await chatResponse.json();

      // Convertir a audio
      const ttsResponse = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: response,
          voice: 'female',
        }),
      });

      const audioBlob = await ttsResponse.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      // Reproducir audio
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        await audioRef.current.play();
      }
    } catch (error) {
      console.error('[v0] Error en mensaje programado:', error);
      setState('idle');
      setStatusText(`Hola, soy ${settings.petName}`);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      recordingStartTimeRef.current = Date.now();
      setIsRecording(true);
      setState('listening');
      setStatusText('Estoy escuchando...');
    } catch (error) {
      console.error('[v0] Error al iniciar grabación:', error);
      setStatusText('No pude acceder al micrófono');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    try {
      // Calcular duración de la grabación
      const recordingDuration = Date.now() - recordingStartTimeRef.current;
      console.log('[v0] Duración de grabación:', recordingDuration, 'ms');

      // Validar duración mínima (500ms)
      if (recordingDuration < 500) {
        console.log('[v0] Grabación demasiado corta, ignorando');
        setState('idle');
        setStatusText('Mantené presionado el botón mientras hablás');
        return;
      }

      setState('processing');
      setStatusText('Estoy pensando...');

      // Convertir audio a texto
      console.log('[v0] Tamaño del audio:', audioBlob.size, 'bytes');
      console.log('[v0] Tipo de audio:', audioBlob.type);

      const formData = new FormData();
      formData.append('audio', audioBlob, 'audio.webm');

      const sttResponse = await fetch('/api/speech-to-text', {
        method: 'POST',
        body: formData,
      });

      const sttData = await sttResponse.json();
      console.log('[v0] Respuesta STT:', sttData);

      if (!sttResponse.ok) {
        console.error('[v0] Error en STT:', sttData.error);
        setState('idle');
        setStatusText('No te escuché bien, ¿podés repetir?');
        return;
      }

      const { text } = sttData;

      if (!text) {
        setState('idle');
        setStatusText('No te escuché bien, ¿podés repetir?');
        return;
      }

      console.log('[v0] Texto transcrito:', text);

      // Obtener respuesta del chat
      const chatResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      const { response } = await chatResponse.json();

      // Convertir respuesta a audio
      setState('speaking');
      setStatusText('Estoy hablando...');

      const ttsResponse = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: response,
          voice: 'female',
        }),
      });

      const audioResponseBlob = await ttsResponse.blob();
      const audioUrl = URL.createObjectURL(audioResponseBlob);

      // Reproducir audio
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        await audioRef.current.play();
      }
    } catch (error) {
      console.error('[v0] Error procesando audio:', error);
      setState('idle');
      setStatusText('Hubo un problema, intentá de nuevo');
    }
  };

  const handleAudioEnded = () => {
    setState('idle');
    setStatusText('¿Querés hablar conmigo?');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-4 sm:p-6 bg-gradient-to-b from-amber-50 to-orange-50">
      {/* Audio element */}
      <audio ref={audioRef} onEnded={handleAudioEnded} className="hidden" />

      {/* Controles superiores para familiares */}
      <div className="w-full max-w-md flex flex-row justify-center items-center gap-4 sm:gap-6 p-2 sm:p-3 bg-white rounded-xl shadow-sm">
        <SettingsDialog onSettingsChange={handleSettingsChange} />

        <div className="flex items-center gap-2">
          <Switch
            id="rest-mode"
            checked={restMode}
            onCheckedChange={setRestMode}
            className="scale-90 sm:scale-100"
          />
          <Label htmlFor="rest-mode" className="text-xs sm:text-sm flex items-center gap-1 whitespace-nowrap">
            <Moon className="w-3 h-3 sm:w-4 sm:h-4" />
            Descanso
          </Label>
        </div>
      </div>

      {/* Área central con el avatar */}
      <div className="flex flex-col items-center gap-6 sm:gap-8 flex-1 justify-center w-full max-w-md px-4">
        <SchnauzerAvatar
          state={
            restMode
              ? 'sleeping'
              : state === 'idle'
                ? 'idle'
                : state === 'listening'
                  ? 'listening'
                  : 'speaking'
          }
        />

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center leading-relaxed px-4">
          {statusText}
        </h1>

        {/* Botón principal */}
        <Button
          size="lg"
          className={`text-xl sm:text-2xl py-6 sm:py-8 px-8 sm:px-12 rounded-full font-bold shadow-xl transition-all w-full sm:w-auto ${
            restMode || state === 'processing' || state === 'speaking'
              ? 'bg-gray-400 cursor-not-allowed'
              : isRecording
                ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                : 'bg-blue-500 hover:bg-blue-600'
          }`}
          onClick={isRecording ? stopRecording : startRecording}
          disabled={restMode || state === 'processing' || state === 'speaking'}
        >
          {isRecording ? (
            <>
              <MicOff className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3" />
              DEJAR DE HABLAR
            </>
          ) : (
            <>
              <Mic className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3" />
              HABLAR
            </>
          )}
        </Button>

        {state === 'processing' && (
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" />
            <div
              className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: '0.2s' }}
            />
            <div
              className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: '0.4s' }}
            />
          </div>
        )}
      </div>

      {/* Espacio inferior */}
      <div className="h-12 sm:h-16" />
    </div>
  );
}
