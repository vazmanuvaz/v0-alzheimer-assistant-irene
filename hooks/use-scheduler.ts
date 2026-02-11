'use client';

import { useEffect, useCallback } from 'react';

interface SchedulerOptions {
  onScheduledMessage: (instruction: string) => void;
  enabled: boolean;
  schedules: Array<{ hour: number; minute: number; instruction: string }>;
}

export function useScheduler({ onScheduledMessage, enabled, schedules }: SchedulerOptions) {
  const checkSchedule = useCallback(() => {
    if (!enabled || schedules.length === 0) return;

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const today = now.toDateString();

    // Obtener última ejecución del localStorage
    const lastExecution = localStorage.getItem('lastScheduledExecution');
    const lastExecutionData = lastExecution ? JSON.parse(lastExecution) : null;

    // Verificar si ya se ejecutó hoy a esta hora y minuto
    if (
      lastExecutionData?.date === today &&
      lastExecutionData?.hour === currentHour &&
      lastExecutionData?.minute === currentMinute
    ) {
      return; // Ya se ejecutó
    }

    // Buscar si hay un schedule para esta hora y minuto exactos
    const currentSchedule = schedules.find(
      (s) => s.hour === currentHour && s.minute === currentMinute
    );

    // Ejecutar si coincide la hora y minuto
    if (currentSchedule) {
      console.log('[v0] Ejecutando mensaje programado para las', currentHour, ':', currentMinute);

      // Guardar ejecución
      localStorage.setItem(
        'lastScheduledExecution',
        JSON.stringify({ date: today, hour: currentHour, minute: currentMinute })
      );

      // Ejecutar callback con la instrucción
      onScheduledMessage(currentSchedule.instruction);
    }
  }, [onScheduledMessage, enabled, schedules]);

  useEffect(() => {
    // Chequear inmediatamente
    checkSchedule();

    // Chequear cada 30 segundos
    const interval = setInterval(checkSchedule, 30000);

    return () => clearInterval(interval);
  }, [checkSchedule]);
}
