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
        <ellipse cx="100" cy="145" rx="45" ry="48" fill="#6B7280" />
        
        {/* Textura de pelaje en el cuerpo */}
        <ellipse cx="100" cy="145" rx="40" ry="43" fill="#E5E7EB" opacity="0.4" />

        {/* Cabeza - forma más cuadrada típica del schnauzer */}
        <rect x="55" y="45" width="90" height="75" rx="15" fill="#6B7280" />
        
        {/* Parte superior de la cabeza más peluda */}
        <ellipse cx="100" cy="55" rx="48" ry="25" fill="#4B5563" />

        {/* Orejas caídas y peludas - característica del schnauzer */}
        <ellipse
          cx="60"
          cy="65"
          rx="18"
          ry="35"
          fill="#4B5563"
          className={state === 'listening' ? 'animate-wiggle' : ''}
        />
        <ellipse
          cx="62"
          cy="70"
          rx="14"
          ry="28"
          fill="#9CA3AF"
          opacity="0.3"
          className={state === 'listening' ? 'animate-wiggle' : ''}
        />
        <ellipse
          cx="140"
          cy="65"
          rx="18"
          ry="35"
          fill="#4B5563"
          className={state === 'listening' ? 'animate-wiggle' : ''}
        />
        <ellipse
          cx="138"
          cy="70"
          rx="14"
          ry="28"
          fill="#9CA3AF"
          opacity="0.3"
          className={state === 'listening' ? 'animate-wiggle' : ''}
        />

        {/* Hocico rectangular más largo */}
        <rect x="70" y="85" width="60" height="35" rx="8" fill="#9CA3AF" />
        <rect x="75" y="90" width="50" height="25" rx="5" fill="#E5E7EB" opacity="0.4" />

        {/* Nariz grande y prominente */}
        <ellipse cx="100" cy="93" rx="10" ry="8" fill="#1F2937" />

        {/* Barba larga y tupida - CARACTERÍSTICA PRINCIPAL */}
        <path
          d="M 65 110 Q 70 125 80 128 Q 90 130 100 130 Q 110 130 120 128 Q 130 125 135 110"
          fill="#4B5563"
        />
        <path
          d="M 70 112 Q 75 122 85 125 Q 95 127 100 127 Q 105 127 115 125 Q 125 122 130 112"
          fill="#E5E7EB"
          opacity="0.3"
        />

        {/* Cejas MUY prominentes y tupidas - CARACTERÍSTICA ICÓNICA */}
        <path
          d="M 70 68 Q 75 60 85 62 L 88 70 Q 82 72 75 70 Z"
          fill="#374151"
        />
        <ellipse cx="79" cy="65" rx="10" ry="6" fill="#4B5563" />
        
        <path
          d="M 130 68 Q 125 60 115 62 L 112 70 Q 118 72 125 70 Z"
          fill="#374151"
        />
        <ellipse cx="121" cy="65" rx="10" ry="6" fill="#4B5563" />

        {/* Ojos oscuros bajo las cejas */}
        <circle
          cx="82"
          cy="78"
          r="7"
          fill="#1F2937"
          className={state === 'idle' ? 'animate-blink' : ''}
        />
        <circle
          cx="118"
          cy="78"
          r="7"
          fill="#1F2937"
          className={state === 'idle' ? 'animate-blink' : ''}
        />
        {/* Brillos en los ojos */}
        <circle cx="84" cy="76" r="2.5" fill="white" />
        <circle cx="120" cy="76" r="2.5" fill="white" />

        {/* Bigotes a los lados */}
        <line x1="65" y1="100" x2="45" y2="98" stroke="#374151" strokeWidth="1.5" />
        <line x1="65" y1="103" x2="45" y2="105" stroke="#374151" strokeWidth="1.5" />
        <line x1="135" y1="100" x2="155" y2="98" stroke="#374151" strokeWidth="1.5" />
        <line x1="135" y1="103" x2="155" y2="105" stroke="#374151" strokeWidth="1.5" />

        {/* Boca */}
        {state === 'speaking' ? (
          <>
            <ellipse cx="100" cy="105" rx="12" ry="10" fill="#374151" />
            <path
              d="M 88 105 Q 100 112 112 105"
              fill="none"
              stroke="#1F2937"
              strokeWidth="2"
            />
          </>
        ) : (
          <path
            d="M 88 105 Q 100 108 112 105"
            fill="none"
            stroke="#1F2937"
            strokeWidth="2"
            strokeLinecap="round"
          />
        )}

        {/* Detalles de pelaje en mejillas */}
        <path
          d="M 55 90 Q 58 95 55 100"
          fill="none"
          stroke="#4B5563"
          strokeWidth="2"
          opacity="0.5"
        />
        <path
          d="M 145 90 Q 142 95 145 100"
          fill="none"
          stroke="#4B5563"
          strokeWidth="2"
          opacity="0.5"
        />

        {/* Cola corta típica */}
        <rect
          x="135"
          y="140"
          width="12"
          height="25"
          rx="6"
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
