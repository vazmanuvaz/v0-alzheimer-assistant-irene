-- Tabla para guardar las configuraciones de la app
create table if not exists public.app_settings (
  id uuid primary key default gen_random_uuid(),
  pet_name text not null default 'Picha',
  schedules jsonb not null default '[]'::jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Solo permitir una fila de configuración
create unique index if not exists single_settings_row on public.app_settings ((true));

-- Insertar configuración por defecto si no existe
insert into public.app_settings (pet_name, schedules)
values (
  'Picha',
  '[
    {"hour": 10, "minute": 0, "instruction": "Hola, ¿cómo te sentís hoy? ¿Querés contarme algo lindo?"},
    {"hour": 13, "minute": 0, "instruction": "¿Te acordás del nombre de tu mamá? Me encantaría que me cuentes algo de ella."},
    {"hour": 16, "minute": 0, "instruction": "Vamos a jugar un poco. Decime: una flor, un color y un animal. Después los repetimos juntos."},
    {"hour": 19, "minute": 0, "instruction": "¿Preferís tomar té o café? Contame cuál te gusta más."},
    {"hour": 21, "minute": 0, "instruction": "¿Sabés qué día es hoy? No importa si no te acordás, estoy acá para acompañarte."}
  ]'::jsonb
)
on conflict do nothing;

-- Deshabilitar RLS para acceso público (app de usuario único)
alter table public.app_settings disable row level security;
