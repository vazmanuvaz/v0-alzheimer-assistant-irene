'use client';

import Image from 'next/image';

type AvatarState = 'idle' | 'listening' | 'speaking';

interface SchnauzerAvatarProps {
  state: AvatarState;
}

const stateImages: Record<AvatarState, string> = {
  idle: '/schnauzer-idle.jpg',
  listening: '/schnauzer-listening.jpg',
  speaking: '/schnauzer-speaking.jpg',
};

export function SchnauzerAvatar({ state }: SchnauzerAvatarProps) {
  return (
    <div className="relative w-72 h-72">
      {/* Outer ring glow based on state */}
      <div
        className="absolute -inset-2 rounded-full transition-all duration-700"
        style={{
          background:
            state === 'listening'
              ? 'radial-gradient(circle, rgba(59,130,246,0.2) 60%, transparent 70%)'
              : state === 'speaking'
                ? 'radial-gradient(circle, rgba(34,197,94,0.2) 60%, transparent 70%)'
                : 'transparent',
          animation:
            state === 'listening'
              ? 'pulse-glow 2s ease-in-out infinite'
              : state === 'speaking'
                ? 'pulse-glow 1.2s ease-in-out infinite'
                : 'none',
        }}
      />

      {/* Main circular container */}
      <div
        className={`relative w-full h-full rounded-full overflow-hidden transition-shadow duration-500 ${
          state === 'idle'
            ? 'shadow-lg'
            : state === 'listening'
              ? 'shadow-[0_0_0_4px_rgba(59,130,246,0.4),0_0_20px_rgba(59,130,246,0.15)]'
              : 'shadow-[0_0_0_4px_rgba(34,197,94,0.4),0_0_20px_rgba(34,197,94,0.15)]'
        }`}
      >
        {/* Render all three images, crossfade via opacity */}
        {(['idle', 'listening', 'speaking'] as AvatarState[]).map((s) => (
          <div
            key={s}
            className="absolute inset-0 transition-opacity duration-500 ease-in-out"
            style={{ opacity: state === s ? 1 : 0 }}
          >
            <Image
              src={stateImages[s] || "/placeholder.svg"}
              alt={`Schnauzer ${s}`}
              fill
              className="object-cover"
              priority
              sizes="288px"
            />
          </div>
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
