'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const Schnauzer3DScene = dynamic(
  () => import('@/components/schnauzer-3d-scene'),
  {
    ssr: false,
    loading: () => (
      <div className="w-72 h-72 rounded-full flex items-center justify-center bg-blue-100">
        <div className="flex gap-2">
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" />
          <div
            className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"
            style={{ animationDelay: '0.15s' }}
          />
          <div
            className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"
            style={{ animationDelay: '0.3s' }}
          />
        </div>
      </div>
    ),
  }
);

interface SchnauzerAvatarProps {
  state: 'idle' | 'listening' | 'speaking';
}

export function SchnauzerAvatar({ state }: SchnauzerAvatarProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-72 h-72 rounded-full flex items-center justify-center bg-blue-100">
        <div className="flex gap-2">
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" />
          <div
            className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"
            style={{ animationDelay: '0.15s' }}
          />
          <div
            className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"
            style={{ animationDelay: '0.3s' }}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-72 h-72 rounded-full"
      style={{
        background:
          'radial-gradient(circle, #dbeafe 0%, #bfdbfe 70%, #93c5fd 100%)',
      }}
    >
      <Schnauzer3DScene state={state} />
    </div>
  );
}
