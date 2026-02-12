import { createClient } from '@/lib/supabase/client';

export interface ScheduleConfig {
  hour: number;
  minute: number;
  instruction: string;
}

export interface AppSettings {
  petName: string;
  schedules: ScheduleConfig[];
}

export const DEFAULT_SETTINGS: AppSettings = {
  petName: 'Picha',
  schedules: [
    { hour: 10, minute: 0, instruction: 'Hola, ¿cómo te sentís hoy? ¿Querés contarme algo lindo?' },
    { hour: 13, minute: 0, instruction: '¿Te acordás del nombre de tu mamá? Me encantaría que me cuentes algo de ella.' },
    { hour: 16, minute: 0, instruction: 'Vamos a jugar un poco. Decime: una flor, un color y un animal. Después los repetimos juntos.' },
    { hour: 19, minute: 0, instruction: '¿Preferís tomar té o café? Contame cuál te gusta más.' },
    { hour: 21, minute: 0, instruction: '¿Sabés qué día es hoy? No importa si no te acordás, estoy acá para acompañarte.' },
  ],
};

export async function loadSettings(): Promise<AppSettings> {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('app_settings')
      .select('pet_name, schedules')
      .single();

    if (error) {
      console.error('[v0] Error loading settings from Supabase:', error);
      return DEFAULT_SETTINGS;
    }

    if (data) {
      return {
        petName: data.pet_name,
        schedules: data.schedules as ScheduleConfig[],
      };
    }

    return DEFAULT_SETTINGS;
  } catch (error) {
    console.error('[v0] Error loading settings:', error);
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: AppSettings): Promise<boolean> {
  try {
    const supabase = createClient();

    // Primero verificar si existe una fila
    const { data: existing } = await supabase
      .from('app_settings')
      .select('id')
      .single();

    if (existing) {
      // Actualizar la fila existente
      const { error } = await supabase
        .from('app_settings')
        .update({
          pet_name: settings.petName,
          schedules: settings.schedules,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id);

      if (error) {
        console.error('[v0] Error updating settings:', error);
        return false;
      }
    } else {
      // Insertar nueva fila
      const { error } = await supabase
        .from('app_settings')
        .insert({
          pet_name: settings.petName,
          schedules: settings.schedules,
        });

      if (error) {
        console.error('[v0] Error inserting settings:', error);
        return false;
      }
    }

    console.log('[v0] Settings saved successfully to Supabase');
    return true;
  } catch (error) {
    console.error('[v0] Error saving settings:', error);
    return false;
  }
}
