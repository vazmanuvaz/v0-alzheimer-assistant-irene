'use client';

import { useEffect, useCallback } from 'react';

const SCHEDULED_TIMES = [10, 13, 16, 19, 21]; // Horas del día

interface SchedulerOptions {
  onScheduledMessage: () => void;
  enabled: boolean;
}

export function useScheduler({ onScheduledMessage, enabled }: SchedulerOptions) {
  const checkSchedule = useCallback(() => {
    if (!enabled) return;

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const today = now.toDateString();

    // Obtener última ejecución del localStorage
    const lastExecution = localStorage.getItem('lastScheduledExecution');
    const lastExecutionData = lastExecution ? JSON.parse(lastExecution) : null;

    // Verificar si ya se ejecutó hoy a esta hora
    if (lastExecutionData?.date === today && lastExecutionData?.hour === currentHour) {
      return; // Ya se ejecutó
    }

    // Verificar si es una hora programada y estamos en los primeros 2 minutos
    if (SCHEDULED_TIMES.includes(currentHour) && currentMinute < 2) {
      console.log('[v0] Ejecutando mensaje programado para las', currentHour);
      
      // Guardar ejecución
      localStorage.setItem(
        'lastScheduledExecution',
        JSON.stringify({ date: today, hour: currentHour })
      );

      // Ejecutar callback
      onScheduledMessage();
    }
  }, [onScheduledMessage, enabled]);

  useEffect(() => {
    // Chequear inmediatamente
    checkSchedule();

    // Chequear cada 30 segundos
    const interval = setInterval(checkSchedule, 30000);

    return () => clearInterval(interval);
  }, [checkSchedule]);
}
