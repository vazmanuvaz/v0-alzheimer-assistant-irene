-- Crear tabla para registrar los heartbeats
CREATE TABLE IF NOT EXISTS public.app_heartbeat (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  last_ping TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  device_info TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Solo permitir una fila
CREATE UNIQUE INDEX IF NOT EXISTS single_heartbeat_row ON public.app_heartbeat ((true));

-- Insertar fila inicial
INSERT INTO public.app_heartbeat (last_ping)
SELECT NOW()
WHERE NOT EXISTS (SELECT 1 FROM public.app_heartbeat LIMIT 1);

-- Deshabilitar RLS para acceso público
ALTER TABLE public.app_heartbeat DISABLE ROW LEVEL SECURITY;
