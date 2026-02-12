import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const ALERT_EMAIL = 'mstvazquez@gmail.com';
const ALERT_THRESHOLD_MINUTES = 15;

export async function GET() {
  try {
    const supabase = createClient();

    // Obtener el último heartbeat
    const { data, error } = await supabase
      .from('app_heartbeat')
      .select('last_ping')
      .single();

    if (error || !data) {
      console.error('[v0] Error obteniendo heartbeat:', error);
      return NextResponse.json({ error: 'Error obteniendo heartbeat' }, { status: 500 });
    }

    const lastPing = new Date(data.last_ping);
    const now = new Date();
    const minutesSinceLastPing = Math.floor((now.getTime() - lastPing.getTime()) / 1000 / 60);

    console.log('[v0] Último ping hace', minutesSinceLastPing, 'minutos');

    // Si pasó el umbral, enviar email de alerta
    if (minutesSinceLastPing > ALERT_THRESHOLD_MINUTES) {
      try {
        await resend.emails.send({
          from: 'Picha <onboarding@resend.dev>',
          to: ALERT_EMAIL,
          subject: '⚠️ Picha perdió conexión',
          html: `
            <h2>⚠️ Alerta de Conexión</h2>
            <p>La app de Picha no responde desde hace <strong>${minutesSinceLastPing} minutos</strong>.</p>
            <p><strong>Última conexión:</strong> ${lastPing.toLocaleString('es-AR')}</p>
            <hr>
            <p><strong>Posibles causas:</strong></p>
            <ul>
              <li>WiFi desconectado</li>
              <li>App cerrada en el navegador</li>
              <li>Dispositivo apagado o en suspensión</li>
              <li>Pérdida de energía eléctrica</li>
            </ul>
            <p>Te recomendamos verificar la situación cuando puedas.</p>
          `,
        });

        console.log('[v0] Email de alerta enviado');

        return NextResponse.json({
          alert: true,
          minutesSinceLastPing,
          lastPing: lastPing.toISOString(),
          emailSent: true,
        });
      } catch (emailError) {
        console.error('[v0] Error enviando email:', emailError);
        return NextResponse.json({
          alert: true,
          minutesSinceLastPing,
          lastPing: lastPing.toISOString(),
          emailSent: false,
          emailError: String(emailError),
        });
      }
    }

    return NextResponse.json({
      ok: true,
      minutesSinceLastPing,
      lastPing: lastPing.toISOString(),
    });
  } catch (error) {
    console.error('[v0] Error en check-connection:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
