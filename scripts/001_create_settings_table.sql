-- Crear tabla de configuraciones
CREATE TABLE IF NOT EXISTS public.app_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_name TEXT NOT NULL DEFAULT 'Picha',
  schedules JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Solo permitir una fila
CREATE UNIQUE INDEX IF NOT EXISTS single_settings_row ON public.app_settings ((true));

-- Insertar valores por defecto
INSERT INTO public.app_settings (pet_name, schedules)
SELECT 
  'Picha',
  '[
    {"hour": 10, "minute": 0, "instruction": "Hola, ¿cómo te sentís hoy? ¿Querés contarme algo lindo?"},
    {"hour": 13, "minute": 0, "instruction": "¿Te acordás del nombre de tu mamá? Me encantaría que me cuentes algo de ella."},
    {"hour": 16, "minute": 0, "instruction": "Vamos a jugar un poco. Decime: una flor, un color y un animal. Después los repetimos juntos."},
    {"hour": 19, "minute": 0, "instruction": "¿Preferís tomar té o café? Contame cuál te gusta más."},
    {"hour": 21, "minute": 0, "instruction": "¿Sabés qué día es hoy? No importa si no te acordás, estoy acá para acompañarte."}
  ]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.app_settings LIMIT 1);

-- Deshabilitar RLS
ALTER TABLE public.app_settings DISABLE ROW LEVEL SECURITY;
