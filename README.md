# Irene - Asistente de Compañía

PWA para personas con Alzheimer inicial. Un compañero digital amigable representado por un perro schnauzer gris.

## Características

- **Interfaz ultra simple**: Un solo botón grande para hablar
- **Avatar animado**: Perro schnauzer gris con animaciones suaves
- **Mensajes automáticos**: Se pueden configurar recordatorios
- **Modo descanso**: Silencia mensajes automáticos cuando sea necesario
- **Aviso de WiFi caido**: Cron-Job configurado para enviar un mail luego de 15 minutos sin actividad
- **Base de datos**: Creada en Supabase para almacenar horarios de recordatorios, mensajes y respuestas para seguimiento.

## Tecnologías

- Next.js 16 con React 19
- OpenAI (Whisper, GPT-4o, TTS)
- Tailwind CSS
- PWA con Service Worker

## Variables de entorno

Necesitas configurar:

- `OPENAI_API_KEY`: Tu clave de API de OpenAI

## Instalación local

```bash
pnpm install
pnpm dev
```

## Instalación en Android

1. Abre Chrome en el teléfono Android
2. Navega a la URL de la app
3. Toca el menú (⋮) y selecciona "Agregar a pantalla de inicio"
4. La app se instalará como PWA

## Uso

1. **Para la persona mayor**: Solo tocar el botón "HABLAR", hablar, y volver a tocar para enviar
2. **Para familiares**: Usar los controles superiores para cambiar la voz o activar modo descanso

## Seguridad

- Todas las llamadas a OpenAI se hacen desde el servidor
- La API key nunca se expone al cliente
- Los endpoints están protegidos y validan las entradas
