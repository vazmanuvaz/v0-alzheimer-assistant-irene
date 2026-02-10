'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';

type AvatarState = 'idle' | 'listening' | 'speaking';

interface SchnauzerAvatarProps {
  state: AvatarState;
}

// Image mapping:
// - Ears down, mouth closed = idle / default
// - Ears down, eyes closed = blink (generated)
// - Ears up, mouth closed = listening
// - Ears down, mouth open = speaking
const IMAGES = {
  idle: '/dog-ears-down.png',
  blink: '/dog-blink.png',
  listening: '/dog-ears-up.png',
  speaking: '/dog-mouth-open.png',
} as const;

export function SchnauzerAvatar({ state }: SchnauzerAvatarProps) {
  const [isBlinking, setIsBlinking] = useState(false);
  const blinkTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Blink effect in idle state
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
    if (state === 'idle') return isBlinking ? IMAGES.blink : IMAGES.idle;
    if (state === 'listening') return IMAGES.listening;
    return IMAGES.speaking;
  })();

  return (
    <div className="relative w-72 h-72">
      {/* Glow ring for active states */}
      <div
        className="absolute -inset-3 rounded-full transition-all duration-700"
        style={{
          background:
            state === 'listening'
              ? 'radial-gradient(circle, rgba(59,130,246,0.15) 50%, transparent 70%)'
              : state === 'speaking'
                ? 'radial-gradient(circle, rgba(34,197,94,0.15) 50%, transparent 70%)'
                : 'transparent',
          animation:
            state !== 'idle' ? 'pulse-glow 2s ease-in-out infinite' : 'none',
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
            className="absolute inset-0 w-full h-full object-cover scale-150 transition-opacity duration-200"
            style={{
              opacity: src === currentImage ? 1 : 0,
              objectPosition: '50% 35%',
            }}
            priority
            draggable={false}
          />
        ))}
      </div>

      {/* State indicator dot */}
      <div className="absolute bottom-2 right-2 z-10">
        <div
          className={`w-4 h-4 rounded-full border-2 border-white shadow-md transition-colors duration-300 ${
            state === 'idle'
              ? 'bg-gray-400'
              : state === 'listening'
                ? 'bg-blue-500 animate-pulse'
                : 'bg-green-500 animate-pulse'
          }`}
        />
      </div>
    </div>
  );
}
