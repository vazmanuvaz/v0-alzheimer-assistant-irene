# Max - Asistente de Compañía

PWA para personas mayores con Alzheimer inicial. Un compañero digital amigable representado por un perro schnauzer gris llamado Max.

## Características

- **Interfaz ultra simple**: Un solo botón grande para hablar
- **Avatar animado**: Perro schnauzer gris con animaciones suaves
- **Mensajes automáticos**: Se activan a las 10:00, 13:00, 16:00, 19:00 y 21:00
- **Modo descanso**: Silencia mensajes automáticos cuando sea necesario
- **Voz configurable**: Opción entre voz femenina y masculina
- **PWA**: Funciona como app nativa en Android

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

## Mensajes automáticos

La app reproduce mensajes automáticos en horarios fijos:
- 10:00 - Saludo matutino
- 13:00 - Acompañamiento del mediodía
- 16:00 - Merienda
- 19:00 - Tarde/noche
- 21:00 - Despedida

Los mensajes incluyen:
- Preguntas sobre cómo se siente
- Ejercicios de memoria suaves
- Conversaciones sobre familiares
- Juegos simples de memoria

## Seguridad

- Todas las llamadas a OpenAI se hacen desde el servidor
- La API key nunca se expone al cliente
- Los endpoints están protegidos y validan las entradas
