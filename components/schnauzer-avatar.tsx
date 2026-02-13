'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';

type AvatarState = 'idle' | 'listening' | 'speaking' | 'sleeping';

interface SchnauzerAvatarProps {
  state: AvatarState;
}

// Image mapping:
// - Ears down, mouth closed = idle / default
// - Ears down, eyes closed = blink (generated)
// - Ears up, mouth closed = listening
// - Ears down, mouth open = speaking
const IMAGES = {
  idle: '/dog-ears-down.png?v=20260213',
  blink: '/dog-blink.png?v=20260213',
  listening: '/dog-ears-up.png?v=20260213',
  speaking: '/dog-mouth-open.png?v=20260213',
  sleeping: '/dog-sleeping.png?v=20260213',
} as const;

export function SchnauzerAvatar({ state }: SchnauzerAvatarProps) {
  const [isBlinking, setIsBlinking] = useState(false);
  const blinkTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Blink effect in idle state (not in sleeping state)
  useEffect(() => {
    if (state !== 'idle') {
      setIsBlinking(false);
      return;
    }

    const scheduleBlink = () => {
      // Random interval between 2.5s and 5s
      const delay = 2500 + Math.random() * 2500;
      blinkTimeoutRef.current = setTimeout(() => {
        setIsBlinking(true);
        // Blink lasts 250ms
        setTimeout(() => {
          setIsBlinking(false);
          scheduleBlink();
        }, 250);
      }, delay);
    };

    scheduleBlink();

    return () => {
      if (blinkTimeoutRef.current) {
        clearTimeout(blinkTimeoutRef.current);
      }
    };
  }, [state]);

  // Determine which image to show
  const currentImage = (() => {
    if (state === 'sleeping') return IMAGES.sleeping;
    if (state === 'idle') return isBlinking ? IMAGES.blink : IMAGES.idle;
    if (state === 'listening') return IMAGES.listening;
    return IMAGES.speaking;
  })();

  return (
    <div className="relative w-64 h-64 sm:w-72 sm:h-72">
      {/* Glow ring for active states */}
      <div
        className="absolute -inset-3 rounded-full transition-all duration-700"
        style={{
          background:
            state === 'listening'
              ? 'radial-gradient(circle, rgba(59,130,246,0.15) 50%, transparent 70%)'
              : state === 'speaking'
                ? 'radial-gradient(circle, rgba(34,197,94,0.15) 50%, transparent 70%)'
                : state === 'sleeping'
                  ? 'radial-gradient(circle, rgba(139,92,246,0.12) 50%, transparent 70%)'
                  : 'transparent',
          animation:
            state === 'sleeping'
              ? 'pulse-glow 3s ease-in-out infinite'
              : state !== 'idle'
                ? 'pulse-glow 2s ease-in-out infinite'
                : 'none',
        }}
      />

      {/* Container circle */}
      <div
        className="relative w-full h-full rounded-full overflow-hidden flex items-center justify-center"
        style={{
          background: 'radial-gradient(circle at 48% 42%, #f0f4f8 0%, #e2e8f0 60%, #cbd5e1 100%)',
        }}
      >
        {/* Preload all images so transitions are instant */}
        {Object.values(IMAGES).map((src) => (
          <Image
            key={src}
            src={src || "/placeholder.svg"}
            alt=""
            width={400}
            height={400}
            className="absolute inset-0 w-full h-full object-cover scale-125 transition-opacity duration-200"
            style={{
              opacity: src === currentImage ? 1 : 0,
              objectPosition: '50% 35%',
            }}
            priority
            draggable={false}
          />
        ))}
      </div>

    </div>
  );
}
