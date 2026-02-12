import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';

export async function POST() {
  try {
    const supabase = createClient();

    // Actualizar el timestamp del último ping
    const { error } = await supabase
      .from('app_heartbeat')
      .update({ 
        last_ping: new Date().toISOString(),
        device_info: navigator?.userAgent || 'unknown'
      })
      .eq('id', (await supabase.from('app_heartbeat').select('id').single()).data?.id);

    if (error) {
      console.error('[v0] Error actualizando heartbeat:', error);
      return NextResponse.json({ error: 'Error actualizando heartbeat' }, { status: 500 });
    }

    return NextResponse.json({ success: true, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('[v0] Error en heartbeat:', error);
    return NextResponse.json({ error: 'Error en heartbeat' }, { status: 500 });
  }
}
