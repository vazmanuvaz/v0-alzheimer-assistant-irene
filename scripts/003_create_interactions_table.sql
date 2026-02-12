-- Crear tabla de interacciones
CREATE TABLE IF NOT EXISTS public.app_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  interaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  interaction_hour INT NOT NULL,
  interaction_minute INT NOT NULL,
  question TEXT NOT NULL,
  response TEXT DEFAULT 'Sin respuesta',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para consultas rápidas
CREATE INDEX IF NOT EXISTS idx_interactions_date ON public.app_interactions(interaction_date DESC);
CREATE INDEX IF NOT EXISTS idx_interactions_created_at ON public.app_interactions(created_at DESC);

-- Deshabilitar RLS para acceso público
ALTER TABLE public.app_interactions DISABLE ROW LEVEL SECURITY;
