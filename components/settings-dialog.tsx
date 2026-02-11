'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Settings } from 'lucide-react';

export interface ScheduleConfig {
  hour: number;
  minute: number;
  instruction: string;
}

export interface AppSettings {
  petName: string;
  schedules: ScheduleConfig[];
}

const DEFAULT_SETTINGS: AppSettings = {
  petName: 'Max',
  schedules: [
    { hour: 10, minute: 0, instruction: 'Hola, ¿cómo te sentís hoy? ¿Querés contarme algo lindo?' },
    { hour: 13, minute: 0, instruction: '¿Te acordás del nombre de tu mamá? Me encantaría que me cuentes algo de ella.' },
    { hour: 16, minute: 0, instruction: 'Vamos a jugar un poco. Decime: una flor, un color y un animal. Después los repetimos juntos.' },
    { hour: 19, minute: 0, instruction: '¿Preferís tomar té o café? Contame cuál te gusta más.' },
    { hour: 21, minute: 0, instruction: '¿Sabés qué día es hoy? No importa si no te acordás, estoy acá para acompañarte.' },
  ],
};

interface SettingsDialogProps {
  onSettingsChange: (settings: AppSettings) => void;
}

export function SettingsDialog({ onSettingsChange }: SettingsDialogProps) {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  // Cargar configuración del localStorage al montar (solo una vez)
  useEffect(() => {
    const saved = localStorage.getItem('appSettings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings(parsed);
      } catch (error) {
        console.error('[v0] Error cargando configuración:', error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = () => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
    onSettingsChange(settings);
    setOpen(false);
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.setItem('appSettings', JSON.stringify(DEFAULT_SETTINGS));
    onSettingsChange(DEFAULT_SETTINGS);
  };

  const updateSchedule = (index: number, field: 'hour' | 'minute' | 'instruction', value: string | number) => {
    const newSchedules = [...settings.schedules];
    newSchedules[index] = {
      ...newSchedules[index],
      [field]: field === 'hour' || field === 'minute' ? Number(value) : value,
    };
    setSettings({ ...settings, schedules: newSchedules });
  };

  const addSchedule = () => {
    setSettings({
      ...settings,
      schedules: [...settings.schedules, { hour: 12, minute: 0, instruction: '' }],
    });
  };

  const removeSchedule = (index: number) => {
    const newSchedules = settings.schedules.filter((_, i) => i !== index);
    setSettings({ ...settings, schedules: newSchedules });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="bg-white hover:bg-gray-100 shadow-sm">
          <Settings className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configuración</DialogTitle>
          <DialogDescription>
            Configurá el nombre de tu compañero y los horarios de los mensajes automáticos.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Nombre del compañero */}
          <div className="space-y-2">
            <Label htmlFor="pet-name" className="text-base font-semibold">
              Nombre del compañero
            </Label>
            <Input
              id="pet-name"
              value={settings.petName}
              onChange={(e) => setSettings({ ...settings, petName: e.target.value })}
              placeholder="Max"
              className="text-lg"
            />
            <p className="text-sm text-muted-foreground">
              Este nombre aparecerá en el mensaje de bienvenida
            </p>
          </div>

          {/* Horarios programados */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Horarios programados</Label>
              <Button onClick={addSchedule} size="sm" variant="outline">
                Agregar horario
              </Button>
            </div>

            <div className="space-y-4">
              {settings.schedules.map((schedule, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3 bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <Label htmlFor={`hour-${index}`} className="text-sm">
                        Hora (0-23)
                      </Label>
                      <Input
                        id={`hour-${index}`}
                        type="number"
                        min="0"
                        max="23"
                        value={schedule.hour}
                        onChange={(e) => updateSchedule(index, 'hour', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor={`minute-${index}`} className="text-sm">
                        Minuto (0-59)
                      </Label>
                      <Input
                        id={`minute-${index}`}
                        type="number"
                        min="0"
                        max="59"
                        value={schedule.minute}
                        onChange={(e) => updateSchedule(index, 'minute', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeSchedule(index)}
                      className="mt-6 shrink-0"
                    >
                      Eliminar
                    </Button>
                  </div>

                  <div>
                    <Label htmlFor={`instruction-${index}`} className="text-sm">
                      Instrucción / Mensaje
                    </Label>
                    <Textarea
                      id={`instruction-${index}`}
                      value={schedule.instruction}
                      onChange={(e) => updateSchedule(index, 'instruction', e.target.value)}
                      placeholder="Escribí el mensaje que se enviará a esta hora..."
                      className="mt-1 min-h-20"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={handleReset}>
            Restaurar valores predeterminados
          </Button>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Guardar cambios</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
