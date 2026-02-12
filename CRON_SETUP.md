# Configuración del Monitor de Conexión

## Cómo funciona el sistema

1. **La app envía "pings" cada 5 minutos** a `/api/heartbeat`
2. **Un cron job externo verifica cada 15 minutos** llamando a `/api/check-connection`
3. **Si no hubo ping en 15 minutos**, te envía un email a `mstvazquez@gmail.com`

## Configurar el Cron Job (Gratis)

### Opción 1: cron-job.org (Recomendado)

1. Andá a https://cron-job.org/en/
2. Registrate gratis
3. Click en "Create cronjob"
4. Configurá:
   - **Title:** Monitor Picha
   - **URL:** `https://TU_DOMINIO_VERCEL.vercel.app/api/check-connection`
   - **Schedule:** Every 15 minutes
   - **HTTP method:** GET
   - **Enabled:** Yes
5. Save

### Opción 2: EasyCron (Alternativa)

1. Andá a https://www.easycron.com/
2. Registrate gratis
3. Add New Cron Job
4. URL: `https://TU_DOMINIO_VERCEL.vercel.app/api/check-connection`
5. Cron Expression: `*/15 * * * *` (cada 15 minutos)

### Opción 3: Vercel Cron (Más técnico)

Si tu app está en Vercel, podés usar Vercel Cron:
1. Creá un archivo `vercel.json` en la raíz:
```json
{
  "crons": [{
    "path": "/api/check-connection",
    "schedule": "*/15 * * * *"
  }]
}
```
2. Hacé deploy de nuevo

## Reemplazar TU_DOMINIO_VERCEL

Una vez que hagas deploy de la app en Vercel:
- Tu URL será algo como: `picha-app.vercel.app`
- Reemplazá `TU_DOMINIO_VERCEL` con tu dominio real
- Ejemplo: `https://picha-app.vercel.app/api/check-connection`

## Emails que vas a recibir

**Cuando pierda conexión:**
```
Asunto: ⚠️ Picha perdió conexión

La aplicación de Picha no está respondiendo.

Última conexión detectada: 14/02/2025 a las 16:45

Hace 16 minutos que no recibo señales.

Posibles causas:
• WiFi desconectado
• Aplicación cerrada
• Dispositivo apagado o sin batería
• Problema con el router

Por favor verificá la conexión.
```

**Cuando recupere conexión:**
```
Asunto: ✅ Picha volvió a conectarse

La aplicación de Picha volvió a estar en línea.

Última desconexión: 14/02/2025 a las 16:45
Reconectó: 14/02/2025 a las 17:15

Estuvo desconectada durante 30 minutos.
```

## Variables de entorno configuradas

✅ RESEND_API_KEY - Configurada
✅ NEXT_PUBLIC_SUPABASE_URL - Configurada  
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY - Configurada

## Probar el sistema

1. Abrí la app en el navegador
2. Esperá 5 minutos (debería enviar primer ping automático)
3. Cerrá la app o desconectá el WiFi
4. Esperá 15-20 minutos
5. Deberías recibir un email de alerta
