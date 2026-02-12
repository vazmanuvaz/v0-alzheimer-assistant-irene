'use client';

import { useEffect } from 'react';

const HEARTBEAT_INTERVAL = 5 * 60 * 1000; // 5 minutos

export function useHeartbeat() {
  useEffect(() => {
    // Enviar primer ping inmediatamente
    sendHeartbeat();

    // Configurar intervalo para enviar pings cada 5 minutos
    const interval = setInterval(() => {
      sendHeartbeat();
    }, HEARTBEAT_INTERVAL);

    // Cleanup
    return () => clearInterval(interval);
  }, []);
}

async function sendHeartbeat() {
  try {
    const response = await fetch('/api/heartbeat', {
      method: 'POST',
    });

    if (!response.ok) {
      console.error('[v0] Error enviando heartbeat:', response.statusText);
    } else {
      console.log('[v0] Heartbeat enviado correctamente');
    }
  } catch (error) {
    console.error('[v0] Error de red al enviar heartbeat:', error);
  }
}
