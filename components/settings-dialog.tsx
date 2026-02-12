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
import { type AppSettings, type ScheduleConfig, DEFAULT_SETTINGS, saveSettings } from '@/lib/settings';

export type { AppSettings, ScheduleConfig };

interface SettingsDialogProps {
  onSettingsChange: (settings: AppSettings) => void;
  initialSettings: AppSettings;
}

export function SettingsDialog({ onSettingsChange, initialSettings }: SettingsDialogProps) {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);

  // Actualizar settings cuando cambien los initialSettings
  useEffect(() => {
    setSettings(initialSettings);
  }, [initialSettings]);

  const handleSave = async () => {
    setIsSaving(true);
    const success = await saveSettings(settings);
    setIsSaving(false);

    if (success) {
      onSettingsChange(settings);
      setOpen(false);
    } else {
      alert('Error al guardar la configuración. Por favor intentá de nuevo.');
    }
  };

  const handleReset = async () => {
    setSettings(DEFAULT_SETTINGS);
    setIsSaving(true);
    const success = await saveSettings(DEFAULT_SETTINGS);
    setIsSaving(false);
    
    if (success) {
      onSettingsChange(DEFAULT_SETTINGS);
    } else {
      alert('Error al restaurar la configuración. Por favor intentá de nuevo.');
    }
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
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="space-y-1 sm:space-y-2">
          <DialogTitle className="text-lg sm:text-xl">Configuración</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Configurá el nombre de tu compañero y los horarios de los mensajes automáticos.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6 py-3 sm:py-4">
          {/* Nombre del compañero */}
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="pet-name" className="text-sm sm:text-base font-semibold">
              Nombre del compañero
            </Label>
            <Input
              id="pet-name"
              value={settings.petName}
              onChange={(e) => setSettings({ ...settings, petName: e.target.value })}
              placeholder="Max"
              className="text-sm sm:text-base h-9 sm:h-10"
            />
            <p className="text-xs sm:text-sm text-muted-foreground">
              Este nombre aparecerá en el mensaje de bienvenida
            </p>
          </div>

          {/* Horarios programados */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between gap-2">
              <Label className="text-sm sm:text-base font-semibold">Horarios programados</Label>
              <Button onClick={addSchedule} size="sm" variant="outline" className="text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3 bg-transparent">
                + Agregar
              </Button>
            </div>

            <div className="space-y-2.5 sm:space-y-4">
              {settings.schedules.map((schedule, index) => (
                <div key={index} className="border rounded-lg p-2.5 sm:p-4 space-y-2 sm:space-y-3 bg-gray-50">
                  <div className="flex items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <Label htmlFor={`hour-${index}`} className="text-xs sm:text-sm">
                        Hora
                      </Label>
                      <Input
                        id={`hour-${index}`}
                        type="number"
                        min="0"
                        max="23"
                        value={schedule.hour}
                        onChange={(e) => updateSchedule(index, 'hour', e.target.value)}
                        className="mt-0.5 h-8 sm:h-9 text-sm"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Label htmlFor={`minute-${index}`} className="text-xs sm:text-sm">
                        Min.
                      </Label>
                      <Input
                        id={`minute-${index}`}
                        type="number"
                        min="0"
                        max="59"
                        value={schedule.minute}
                        onChange={(e) => updateSchedule(index, 'minute', e.target.value)}
                        className="mt-0.5 h-8 sm:h-9 text-sm"
                      />
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeSchedule(index)}
                      className="mt-5 sm:mt-6 shrink-0 h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm"
                    >
                      ✕
                    </Button>
                  </div>

                  <div>
                    <Label htmlFor={`instruction-${index}`} className="text-xs sm:text-sm">
                      Mensaje
                    </Label>
                    <Textarea
                      id={`instruction-${index}`}
                      value={schedule.instruction}
                      onChange={(e) => updateSchedule(index, 'instruction', e.target.value)}
                      placeholder="Escribí el mensaje..."
                      className="mt-0.5 min-h-16 sm:min-h-20 text-xs sm:text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-0 pt-3 sm:pt-4 border-t">
          <Button variant="outline" onClick={handleReset} className="text-xs sm:text-sm h-9 sm:h-10 order-2 sm:order-1 bg-transparent">
            Restaurar
          </Button>
          <div className="flex gap-2 order-1 sm:order-2">
            <Button variant="ghost" onClick={() => setOpen(false)} className="text-xs sm:text-sm h-9 sm:h-10 flex-1 sm:flex-none" disabled={isSaving}>
              Cancelar
            </Button>
            <Button onClick={handleSave} className="text-xs sm:text-sm h-9 sm:h-10 flex-1 sm:flex-none" disabled={isSaving}>
              {isSaving ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
