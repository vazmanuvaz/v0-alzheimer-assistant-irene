'use client';

interface SchnauzerAvatarProps {
  state: 'idle' | 'listening' | 'speaking';
}

export function SchnauzerAvatar({ state }: SchnauzerAvatarProps) {
  return (
    <div
      className={`relative w-72 h-72 rounded-full overflow-hidden ${
        state === 'idle'
          ? 'animate-breathe'
          : state === 'listening'
            ? 'animate-listening'
            : 'animate-bounce-slow'
      }`}
      style={{
        background:
          'radial-gradient(circle at 50% 45%, #dbeafe 0%, #bfdbfe 60%, #93c5fd 100%)',
      }}
    >
      <svg viewBox="0 0 300 300" className="w-full h-full">
        <defs>
          {/* Fur texture filters */}
          <filter id="fur-texture">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
          </filter>

          {/* Shadow filter */}
          <filter id="soft-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
            <feOffset dx="0" dy="2" />
            <feComposite in2="SourceGraphic" operator="over" />
          </filter>

          {/* Gradient for dark fur */}
          <radialGradient id="dark-fur" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#6B7280" />
            <stop offset="60%" stopColor="#4B5563" />
            <stop offset="100%" stopColor="#374151" />
          </radialGradient>

          {/* Gradient for light beard/chest */}
          <radialGradient id="light-fur" cx="50%" cy="30%" r="60%">
            <stop offset="0%" stopColor="#F3F4F6" />
            <stop offset="50%" stopColor="#D1D5DB" />
            <stop offset="100%" stopColor="#9CA3AF" />
          </radialGradient>

          {/* Eye shine gradient */}
          <radialGradient id="eye-shine" cx="35%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#4B5563" />
            <stop offset="70%" stopColor="#1F2937" />
            <stop offset="100%" stopColor="#111827" />
          </radialGradient>

          {/* Nose gradient */}
          <radialGradient id="nose-grad" cx="40%" cy="35%" r="50%">
            <stop offset="0%" stopColor="#374151" />
            <stop offset="100%" stopColor="#111827" />
          </radialGradient>

          {/* Body chest gradient */}
          <linearGradient id="chest-fur" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D1D5DB" />
            <stop offset="100%" stopColor="#9CA3AF" />
          </linearGradient>
        </defs>

        {/* === BODY === */}
        {/* Main body - chest area visible below head */}
        <ellipse cx="150" cy="250" rx="55" ry="45" fill="url(#dark-fur)" />

        {/* Light chest area */}
        <ellipse cx="150" cy="248" rx="35" ry="30" fill="url(#chest-fur)" />

        {/* Fur detail lines on chest */}
        <path d="M 135 230 Q 138 245 135 260" fill="none" stroke="#9CA3AF" strokeWidth="1" opacity="0.5" />
        <path d="M 150 228 Q 150 248 150 262" fill="none" stroke="#9CA3AF" strokeWidth="1" opacity="0.5" />
        <path d="M 165 230 Q 162 245 165 260" fill="none" stroke="#9CA3AF" strokeWidth="1" opacity="0.5" />

        {/* === HEAD === */}
        {/* Head shadow */}
        <ellipse cx="152" cy="160" rx="62" ry="58" fill="#374151" opacity="0.3" />

        {/* Main head - slightly square/rectangular shape */}
        <rect x="88" y="100" width="124" height="100" rx="30" fill="url(#dark-fur)" />

        {/* Top of head - rounded bump */}
        <ellipse cx="150" cy="108" rx="55" ry="30" fill="#4B5563" />

        {/* Fur tufts on top of head */}
        <path d="M 130 82 Q 133 90 130 100" fill="none" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 140 80 Q 142 90 140 98" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" />
        <path d="M 150 78 Q 152 88 150 96" fill="none" stroke="#4B5563" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 160 80 Q 158 90 160 98" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" />
        <path d="M 170 82 Q 167 90 170 100" fill="none" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" />

        {/* Lighter fur areas on cheeks */}
        <ellipse cx="115" cy="150" rx="18" ry="20" fill="#6B7280" opacity="0.6" />
        <ellipse cx="185" cy="150" rx="18" ry="20" fill="#6B7280" opacity="0.6" />

        {/* === EARS === */}
        {/* Left ear - folded over, characteristic schnauzer V-shape */}
        <g className={state === 'listening' ? 'animate-wiggle' : ''}>
          <path
            d="M 95 110 Q 70 85 65 100 Q 60 115 80 130 Q 90 135 98 125"
            fill="#4B5563"
            stroke="#374151"
            strokeWidth="1"
          />
          {/* Inner ear */}
          <path
            d="M 90 112 Q 75 95 72 105 Q 68 115 82 126"
            fill="#6B7280"
            opacity="0.5"
          />
        </g>

        {/* Right ear */}
        <g className={state === 'listening' ? 'animate-wiggle' : ''} style={{ animationDelay: '0.1s' }}>
          <path
            d="M 205 110 Q 230 85 235 100 Q 240 115 220 130 Q 210 135 202 125"
            fill="#4B5563"
            stroke="#374151"
            strokeWidth="1"
          />
          {/* Inner ear */}
          <path
            d="M 210 112 Q 225 95 228 105 Q 232 115 218 126"
            fill="#6B7280"
            opacity="0.5"
          />
        </g>

        {/* === EYEBROWS - VERY PROMINENT (iconic schnauzer feature) === */}
        {/* Left eyebrow - thick and bushy */}
        <ellipse cx="122" cy="122" rx="18" ry="8" fill="#374151" />
        <path d="M 106 120 Q 112 114 122 116 Q 132 114 138 120" fill="#4B5563" />
        {/* Eyebrow fur strands */}
        <path d="M 108 118 Q 110 112 114 116" fill="none" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 114 116 Q 118 110 122 115" fill="none" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 128 115 Q 132 110 136 118" fill="none" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" />

        {/* Right eyebrow */}
        <ellipse cx="178" cy="122" rx="18" ry="8" fill="#374151" />
        <path d="M 162 120 Q 168 114 178 116 Q 188 114 194 120" fill="#4B5563" />
        {/* Eyebrow fur strands */}
        <path d="M 164 118 Q 166 112 170 116" fill="none" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 176 115 Q 180 110 184 116" fill="none" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 186 116 Q 190 110 192 118" fill="none" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" />

        {/* === EYES === */}
        {/* Left eye */}
        <g className={state === 'idle' ? 'animate-blink' : ''}>
          <ellipse cx="125" cy="138" rx="10" ry="10" fill="url(#eye-shine)" />
          {/* Highlight */}
          <circle cx="122" cy="135" r="3" fill="white" opacity="0.9" />
          <circle cx="128" cy="139" r="1.5" fill="white" opacity="0.5" />
        </g>

        {/* Right eye */}
        <g className={state === 'idle' ? 'animate-blink' : ''}>
          <ellipse cx="175" cy="138" rx="10" ry="10" fill="url(#eye-shine)" />
          {/* Highlight */}
          <circle cx="172" cy="135" r="3" fill="white" opacity="0.9" />
          <circle cx="178" cy="139" r="1.5" fill="white" opacity="0.5" />
        </g>

        {/* === MUZZLE AREA === */}
        {/* Muzzle base - rectangular schnauzer shape */}
        <rect x="118" y="148" width="64" height="32" rx="10" fill="#9CA3AF" />
        {/* Lighter muzzle highlight */}
        <rect x="122" y="150" width="56" height="26" rx="8" fill="#D1D5DB" />

        {/* Nose - big and prominent */}
        <ellipse cx="150" cy="155" rx="12" ry="9" fill="url(#nose-grad)" />
        {/* Nose shine */}
        <ellipse cx="147" cy="152" rx="4" ry="3" fill="#4B5563" opacity="0.5" />

        {/* Nose to mouth line */}
        <path d="M 150 164 L 150 170" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" />

        {/* Mouth */}
        {state === 'speaking' ? (
          <g>
            <ellipse cx="150" cy="174" rx="14" ry="8" fill="#374151" />
            {/* Tongue */}
            <ellipse cx="150" cy="178" rx="8" ry="6" fill="#F87171" />
            <ellipse cx="150" cy="176" rx="6" ry="4" fill="#FCA5A5" />
          </g>
        ) : (
          <g>
            <path d="M 138 172 Q 144 176 150 172" fill="none" stroke="#4B5563" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M 150 172 Q 156 176 162 172" fill="none" stroke="#4B5563" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        )}

        {/* === BEARD - LONG AND FLOWING (the most iconic feature) === */}
        {/* Main beard shape */}
        <path
          d="M 110 170 Q 108 185 112 200 Q 118 215 130 218 Q 140 220 150 220 Q 160 220 170 218 Q 182 215 188 200 Q 192 185 190 170"
          fill="#D1D5DB"
          stroke="#9CA3AF"
          strokeWidth="1"
        />

        {/* Beard fur detail strands */}
        <path d="M 118 175 Q 116 190 118 208" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 128 178 Q 126 195 128 215" fill="none" stroke="#B0B8C4" strokeWidth="1" strokeLinecap="round" />
        <path d="M 138 178 Q 136 198 138 218" fill="none" stroke="#9CA3AF" strokeWidth="1" strokeLinecap="round" />
        <path d="M 150 180 Q 150 200 150 220" fill="none" stroke="#B0B8C4" strokeWidth="1" strokeLinecap="round" />
        <path d="M 162 178 Q 164 198 162 218" fill="none" stroke="#9CA3AF" strokeWidth="1" strokeLinecap="round" />
        <path d="M 172 178 Q 174 195 172 215" fill="none" stroke="#B0B8C4" strokeWidth="1" strokeLinecap="round" />
        <path d="M 182 175 Q 184 190 182 208" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />

        {/* Lighter beard highlight */}
        <path
          d="M 125 175 Q 125 190 130 205 Q 140 212 150 212 Q 160 212 170 205 Q 175 190 175 175"
          fill="#E5E7EB"
          opacity="0.4"
        />

        {/* === WHISKERS === */}
        {/* Left whiskers */}
        <line x1="110" y1="162" x2="75" y2="155" stroke="#6B7280" strokeWidth="1.2" opacity="0.6" />
        <line x1="110" y1="167" x2="72" y2="168" stroke="#6B7280" strokeWidth="1.2" opacity="0.6" />
        <line x1="112" y1="172" x2="78" y2="180" stroke="#6B7280" strokeWidth="1.2" opacity="0.5" />

        {/* Right whiskers */}
        <line x1="190" y1="162" x2="225" y2="155" stroke="#6B7280" strokeWidth="1.2" opacity="0.6" />
        <line x1="190" y1="167" x2="228" y2="168" stroke="#6B7280" strokeWidth="1.2" opacity="0.6" />
        <line x1="188" y1="172" x2="222" y2="180" stroke="#6B7280" strokeWidth="1.2" opacity="0.5" />

        {/* === FUR TEXTURE DETAILS on head === */}
        <path d="M 100 130 Q 103 125 100 120" fill="none" stroke="#374151" strokeWidth="1" opacity="0.4" />
        <path d="M 200 130 Q 197 125 200 120" fill="none" stroke="#374151" strokeWidth="1" opacity="0.4" />
        <path d="M 105 145 Q 108 140 105 135" fill="none" stroke="#4B5563" strokeWidth="1" opacity="0.3" />
        <path d="M 195 145 Q 192 140 195 135" fill="none" stroke="#4B5563" strokeWidth="1" opacity="0.3" />

        {/* === STATE INDICATORS === */}
        {/* Sound waves when speaking */}
        {state === 'speaking' && (
          <g>
            <path
              d="M 60 140 Q 50 150 60 160"
              fill="none"
              stroke="#93C5FD"
              strokeWidth="2"
              opacity="0.6"
            >
              <animate attributeName="opacity" values="0.6;0;0.6" dur="1s" repeatCount="indefinite" />
            </path>
            <path
              d="M 48 130 Q 35 150 48 170"
              fill="none"
              stroke="#93C5FD"
              strokeWidth="2"
              opacity="0.4"
            >
              <animate attributeName="opacity" values="0.4;0;0.4" dur="1s" repeatCount="indefinite" begin="0.3s" />
            </path>
            <path
              d="M 240 140 Q 250 150 240 160"
              fill="none"
              stroke="#93C5FD"
              strokeWidth="2"
              opacity="0.6"
            >
              <animate attributeName="opacity" values="0.6;0;0.6" dur="1s" repeatCount="indefinite" begin="0.1s" />
            </path>
            <path
              d="M 252 130 Q 265 150 252 170"
              fill="none"
              stroke="#93C5FD"
              strokeWidth="2"
              opacity="0.4"
            >
              <animate attributeName="opacity" values="0.4;0;0.4" dur="1s" repeatCount="indefinite" begin="0.4s" />
            </path>
          </g>
        )}

        {/* Listening indicator - ear glow */}
        {state === 'listening' && (
          <g>
            <circle cx="75" cy="105" r="8" fill="#3B82F6" opacity="0.2">
              <animate attributeName="r" values="6;10;6" dur="1.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.2;0.4;0.2" dur="1.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="225" cy="105" r="8" fill="#3B82F6" opacity="0.2">
              <animate attributeName="r" values="6;10;6" dur="1.5s" repeatCount="indefinite" begin="0.2s" />
              <animate attributeName="opacity" values="0.2;0.4;0.2" dur="1.5s" repeatCount="indefinite" begin="0.2s" />
            </circle>
          </g>
        )}
      </svg>
    </div>
  );
}
