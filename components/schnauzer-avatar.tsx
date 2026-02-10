'use client';

interface SchnauzerAvatarProps {
  state: 'idle' | 'listening' | 'speaking';
}

export function SchnauzerAvatar({ state }: SchnauzerAvatarProps) {
  return (
    <div className="relative w-64 h-64">
      <svg
        viewBox="0 0 200 200"
        className={`w-full h-full ${
          state === 'idle'
            ? 'animate-breathe'
            : state === 'listening'
              ? 'animate-listening'
              : 'animate-bounce-slow'
        }`}
      >
        {/* Cuerpo del perro */}
        <ellipse cx="100" cy="140" rx="45" ry="50" fill="#6B7280" />

        {/* Cabeza */}
        <ellipse cx="100" cy="80" rx="50" ry="55" fill="#6B7280" />

        {/* Orejas */}
        <ellipse
          cx="65"
          cy="60"
          rx="15"
          ry="30"
          fill="#4B5563"
          className={state === 'listening' ? 'animate-wiggle' : ''}
        />
        <ellipse
          cx="135"
          cy="60"
          rx="15"
          ry="30"
          fill="#4B5563"
          className={state === 'listening' ? 'animate-wiggle' : ''}
        />

        {/* Hocico */}
        <ellipse cx="100" cy="100" rx="30" ry="25" fill="#9CA3AF" />

        {/* Nariz */}
        <ellipse cx="100" cy="95" rx="8" ry="6" fill="#1F2937" />

        {/* Barba característica del schnauzer */}
        <path
          d="M 70 105 Q 100 120 130 105"
          fill="#4B5563"
          stroke="#4B5563"
          strokeWidth="2"
        />

        {/* Cejas prominentes */}
        <path
          d="M 75 65 Q 82 60 88 65"
          fill="none"
          stroke="#374151"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M 112 65 Q 118 60 125 65"
          fill="none"
          stroke="#374151"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Ojos */}
        <circle
          cx="85"
          cy="75"
          r="6"
          fill="#1F2937"
          className={state === 'idle' ? 'animate-blink' : ''}
        />
        <circle
          cx="115"
          cy="75"
          r="6"
          fill="#1F2937"
          className={state === 'idle' ? 'animate-blink' : ''}
        />
        {/* Brillos en los ojos */}
        <circle cx="87" cy="73" r="2" fill="white" />
        <circle cx="117" cy="73" r="2" fill="white" />

        {/* Boca */}
        {state === 'speaking' ? (
          <>
            <ellipse cx="100" cy="105" rx="10" ry="8" fill="#374151" />
            <path
              d="M 90 105 Q 100 110 110 105"
              fill="none"
              stroke="#1F2937"
              strokeWidth="2"
            />
          </>
        ) : (
          <path
            d="M 90 105 Q 100 108 110 105"
            fill="none"
            stroke="#1F2937"
            strokeWidth="2"
            strokeLinecap="round"
          />
        )}

        {/* Cola (visible desde el frente) */}
        <ellipse
          cx="140"
          cy="145"
          rx="8"
          ry="20"
          fill="#6B7280"
          className={state === 'idle' ? 'animate-tail-wag' : ''}
        />
      </svg>

      {/* Burbuja de habla cuando está hablando */}
      {state === 'speaking' && (
        <div className="absolute -right-4 top-8 bg-white rounded-full p-3 shadow-lg animate-bounce-slow">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
            <div
              className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
              style={{ animationDelay: '0.2s' }}
            />
            <div
              className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
              style={{ animationDelay: '0.4s' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
