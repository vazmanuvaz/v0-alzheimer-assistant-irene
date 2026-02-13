# Irene - Asistente Virtual para Personas con Alzheimer

Picha es una aplicación web interactiva diseñada para acompañar a personas con Alzheimer. 
Se presenta como un perro schnauzer virtual que puede conversar por voz, mantener horarios programados de interacción y enviar alertas cuando detecta problemas de conectividad.

## Características Principales

- **Conversación por Voz**: Habla con Picha usando el micrófono y recibe respuestas en voz femenina
- **Horarios Programados**: Configura mensajes automáticos en horarios específicos (ej: recordatorios, preguntas de memoria)
- **Avatar Animado**: Un schnauzer gris amigable que responde visualmente a las interacciones
- **Modo Descanso**: Pausa la interacción cuando la persona necesita descansar
- **Monitoreo Remoto**: 
  - Sistema de alertas por email cuando se pierde la conexión WiFi
  - Registro de todas las conversaciones en base de datos
  - Seguimiento de actividad para familiares
- **Persistencia en la Nube**: Configuraciones guardadas en Supabase
- **PWA**: Funciona como app nativa en Android/iOS

## Tecnologías Utilizadas

- **Frontend**: Next.js 16 con React 19
- **UI**: Tailwind CSS + shadcn/ui
- **Base de Datos**: Supabase (PostgreSQL)
- **AI**: OpenAI GPT-4 (vía Vercel AI Gateway)
- **Text-to-Speech**: ElevenLabs
- **Email**: Resend
- **Monitoreo**: cron-job.org

#---------------------------------------------------------------------------------------------------------------------------------------
# IMPORTANTE
🔒 Seguridad:

Las claves privadas (OpenAI, Resend, etc.) solo deben configurarse en variables de entorno en Vercel.

Nunca subir .env.local al repositorio.

La anon public key de Supabase es segura para frontend, pero no debe usarse para datos sensibles.
#---------------------------------------------------------------------------------------------------------------------------------------


## Requisitos Previos

Antes de comenzar, necesitas tener cuentas en:

1. [Vercel](https://vercel.com) (gratis) - Para hospedar la app
2. [Supabase](https://supabase.com) (gratis) - Base de datos
3. [Resend](https://resend.com) (gratis hasta 3,000 emails/mes) - Emails de alerta
4. [cron-job.org](https://cron-job.org) (gratis) - Monitoreo automático
5. Node.js 18+ instalado (solo para desarrollo local)

## Instalación Paso a Paso

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/picha-alzheimer-assistant.git
cd picha-alzheimer-assistant
npm install
```

### 2. Configurar Supabase

#### 2.1. Crear Proyecto

1. Ve a https://supabase.com y crea una cuenta
2. Click en "New Project"
3. Dale un nombre: "picha-app"
4. Elige una región cercana
5. Crea una contraseña segura (guárdala)
6. Espera 2-3 minutos

#### 2.2. Ejecutar Migraciones SQL

En Supabase, ve a "SQL Editor" y ejecuta estos 3 scripts (están en `/scripts`):

**Script 1: Tabla de Configuraciones**
```sql
CREATE TABLE IF NOT EXISTS public.app_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_name TEXT NOT NULL DEFAULT 'Picha',
  schedules JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS single_settings_row ON public.app_settings ((true));

INSERT INTO public.app_settings (pet_name, schedules)
SELECT 'Picha', '[
  {"hour": 10, "minute": 0, "instruction": "Hola, ¿cómo te sentís hoy? ¿Querés contarme algo lindo?"},
  {"hour": 13, "minute": 0, "instruction": "¿Te acordás del nombre de tu mamá? Me encantaría que me cuentes algo de ella."},
  {"hour": 16, "minute": 0, "instruction": "Vamos a jugar un poco. Decime: una flor, un color y un animal. Después los repetimos juntos."},
  {"hour": 19, "minute": 0, "instruction": "¿Preferís tomar té o café? Contame cuál te gusta más."},
  {"hour": 21, "minute": 0, "instruction": "¿Sabés qué día es hoy? No importa si no te acordás, estoy acá para acompañarte."}
]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.app_settings LIMIT 1);

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
```

**Script 2: Tabla de Heartbeat (ping de vida)**
```sql
CREATE TABLE IF NOT EXISTS public.app_heartbeat (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  last_ping TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  device_info TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS single_heartbeat_row ON public.app_heartbeat ((true));

INSERT INTO public.app_heartbeat (last_ping)
SELECT NOW()
WHERE NOT EXISTS (SELECT 1 FROM public.app_heartbeat LIMIT 1);

ALTER TABLE public.app_heartbeat ENABLE ROW LEVEL SECURITY;
```

**Script 3: Tabla de Interacciones**
```sql
CREATE TABLE IF NOT EXISTS public.app_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  interaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  interaction_hour INT NOT NULL,
  interaction_minute INT NOT NULL,
  question TEXT NOT NULL,
  response TEXT DEFAULT 'Sin respuesta',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_interactions_date ON public.app_interactions(interaction_date DESC);
CREATE INDEX IF NOT EXISTS idx_interactions_created_at ON public.app_interactions(created_at DESC);

ALTER TABLE public.app_interactions ENABLE ROW LEVEL SECURITY;
```

**Script 4: Lectura / Escritura

```sql
CREATE POLICY "Allow public read/write settings"
ON public.app_settings
FOR ALL
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow public read/write heartbeat"
ON public.app_heartbeat
FOR ALL
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow public read/write interactions"
ON public.app_interactions
FOR ALL
USING (true)
WITH CHECK (true);

```



#### 2.3. Obtener Credenciales

1. En Supabase, ve a "Project Settings" > "API"
2. Copia:
   - **Project URL** (ej: `https://xxxxx.supabase.co`)
   - **anon public key** (empieza con `eyJ...`)

### 3. Configurar Resend (Email)

1. Ve a https://resend.com y crea una cuenta
2. Ve a "API Keys"
3. Click "Create API Key"
4. Nombre: "Picha Monitor"
5. Copia la key (empieza con `re_...`)

### 4. Variables de Entorno

Crea un archivo `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
RESEND_API_KEY=tu_api_key_de_resend
ADMIN_EMAIL=tu_email@gmail.com
```

### 5. Desplegar en Vercel

1. Ve a https://vercel.com
2. "New Project" > Importa tu repositorio GitHub
3. Agrega las mismas variables de entorno
4. Click "Deploy"
5. Espera 2-3 minutos
6. Copia tu URL: `https://tu-app.vercel.app`

### 6. Configurar Monitoreo

1. Ve a https://cron-job.org
2. "CREATE CRONJOB"
3. Configura:
   - **Title**: Monitor Picha WiFi
   - **URL**: `https://tu-app.vercel.app/api/check-connection`
   - **Schedule**: Every 15 minutes
4. Guarda

Ahora recibirás emails automáticos si la app pierde WiFi por más de 15 minutos.

## Uso de la Aplicación

### Para la Persona Mayor

1. Abrir la app en Chrome/Safari
2. Click en "HABLAR"
3. Hablar cuando aparece el micrófono rojo
4. Picha responde automáticamente por voz

### Para Familiares

#### Configurar Horarios

1. Click en el engranaje (⚙️)
2. Editar nombre del compañero
3. Agregar/modificar horarios:
   - Hora y minuto específicos
   - Mensaje personalizado
4. "Guardar"

#### Ver Conversaciones

1. Ve a Supabase > Table Editor
2. Tabla `app_interactions`
3. Ver todas las conversaciones con fecha y hora

## Estructura del Proyecto

```
├── app/
│   ├── api/
│   │   ├── chat/route.ts              # IA conversacional
│   │   ├── tts/route.ts               # Text-to-Speech
│   │   ├── heartbeat/route.ts         # Ping cada 5 min
│   │   └── check-connection/route.ts  # Detector de desconexión
│   └── page.tsx                       # Página principal
├── components/
│   ├── schnauzer-avatar.tsx           # Avatar del perro
│   └── settings-dialog.tsx            # Configuración
├── hooks/
│   ├── use-scheduler.ts               # Mensajes programados
│   └── use-heartbeat.ts               # Sistema de ping
├── lib/
│   ├── supabase/client.ts             # Cliente DB
│   └── settings.ts                    # Gestión configuraciones
└── scripts/                           # Migraciones SQL
```

## Solución de Problemas

### El micrófono no funciona
- Da permisos al navegador
- Usa HTTPS (Vercel lo da automáticamente)
- Prueba Chrome o Edge

### No se guardan configuraciones
- Verifica variables `NEXT_PUBLIC_SUPABASE_*`
- Revisa en Supabase que exista la tabla `app_settings`

### No llegan emails
- Verifica `RESEND_API_KEY` en Vercel
- Confirma que el cron job esté activo
- Revisa spam

### No se escucha la voz
- Verifica volumen del dispositivo
- Interactúa con la página primero
- Revisa conexión a internet

## Instalación en Android/iOS

1. Abre la app en Chrome (Android) o Safari (iOS)
2. Menú > "Agregar a pantalla de inicio"
3. La app se instala como PWA nativa

## Seguridad

- Conversaciones encriptadas en Supabase
- API keys nunca expuestas en frontend
- No se almacenan datos personales fuera de los servicios configurados por el usuario.
- App de uso personal

## Licencia

MIT License - Libre uso, modificación y distribución

## Contribuciones

Issues y pull requests son bienvenidos

## Soporte

1. Revisa "Solución de Problemas"
2. Abre un issue en GitHub
3. Contacta al desarrollador

---

**Nota**: Esta app es de acompañamiento y no reemplaza atención médica profesional.

Creado con cariño para mi abuela Ire.
