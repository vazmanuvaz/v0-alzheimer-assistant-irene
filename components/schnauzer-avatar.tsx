'use client';

import { useEffect, useState } from 'react';

type AvatarState = 'idle' | 'listening' | 'speaking';

interface SchnauzerAvatarProps {
  state: AvatarState;
}

export function SchnauzerAvatar({ state }: SchnauzerAvatarProps) {
  const [blinkOpen, setBlinkOpen] = useState(true);

  // Blink every few seconds in idle
  useEffect(() => {
    if (state !== 'idle') {
      setBlinkOpen(true);
      return;
    }
    const interval = setInterval(() => {
      setBlinkOpen(false);
      setTimeout(() => setBlinkOpen(true), 180);
    }, 3500);
    return () => clearInterval(interval);
  }, [state]);

  return (
    <div className="relative w-72 h-72">
      {/* Outer glow ring */}
      <div
        className="absolute -inset-3 rounded-full transition-all duration-700"
        style={{
          background:
            state === 'listening'
              ? 'radial-gradient(circle, rgba(59,130,246,0.25) 50%, transparent 70%)'
              : state === 'speaking'
                ? 'radial-gradient(circle, rgba(34,197,94,0.25) 50%, transparent 70%)'
                : 'transparent',
          animation:
            state !== 'idle' ? 'pulse-glow 1.8s ease-in-out infinite' : 'none',
        }}
      />

      {/* Circle container */}
      <div
        className="relative w-full h-full rounded-full overflow-hidden flex items-center justify-center"
        style={{
          background:
            'radial-gradient(circle at 45% 40%, #e8edf4 0%, #dce4f0 50%, #c9d5e8 100%)',
        }}
      >
        <svg
          viewBox="0 0 280 280"
          className="w-[85%] h-[85%]"
          style={{ marginTop: '10%' }}
        >
          {/* === BODY === */}
          {/* Main body - dark gray torso */}
          <path
            d="M90 175 Q90 155 105 148 L175 148 Q190 155 190 175 L190 240 Q190 260 140 260 Q90 260 90 240 Z"
            fill="#5a5e63"
            stroke="#222"
            strokeWidth="3"
          />

          {/* Chest patch - lighter gray */}
          <path
            d="M115 155 Q140 150 165 155 L160 200 Q140 205 120 200 Z"
            fill="#9ea3aa"
            stroke="none"
          />
          {/* Chest fur texture lines */}
          <path d="M130 160 Q132 175 128 190" fill="none" stroke="#b8bcc2" strokeWidth="1.5" />
          <path d="M145 158 Q146 175 144 192" fill="none" stroke="#b8bcc2" strokeWidth="1.5" />
          <path d="M155 161 Q154 178 157 188" fill="none" stroke="#b8bcc2" strokeWidth="1.2" />

          {/* Collar - red */}
          <path
            d="M100 152 Q140 142 180 152 Q182 160 180 165 Q140 155 100 165 Q98 160 100 152 Z"
            fill="#cc2a2a"
            stroke="#222"
            strokeWidth="2.5"
          />
          {/* Collar tag */}
          <ellipse cx="140" cy="165" rx="7" ry="8" fill="#e8a820" stroke="#222" strokeWidth="2" />
          <circle cx="140" cy="164" r="2.5" fill="#d4941a" />

          {/* === HEAD === */}
          {/* Head base - dark gray */}
          <ellipse
            cx="140"
            cy="105"
            rx="62"
            ry="58"
            fill="#5a5e63"
            stroke="#222"
            strokeWidth="3"
          />

          {/* Forehead lighter area */}
          <ellipse cx="140" cy="88" rx="30" ry="20" fill="#6e7278" stroke="none" />

          {/* === EARS === */}
          {/* Left ear */}
          <g
            style={{
              transformOrigin: '95px 65px',
              transition: 'transform 0.4s ease',
              transform:
                state === 'listening'
                  ? 'rotate(-12deg) translateY(-4px)'
                  : state === 'speaking'
                    ? 'rotate(-3deg)'
                    : 'rotate(0deg)',
              animation:
                state === 'listening'
                  ? 'ear-twitch-left 1.2s ease-in-out infinite'
                  : 'none',
            }}
          >
            <path
              d="M100 80 L75 40 L60 42 L70 55 L82 82"
              fill="#5a5e63"
              stroke="#222"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <path
              d="M95 75 L78 45 L70 47 L80 65 L88 80"
              fill="#7a7e84"
              stroke="none"
            />
          </g>

          {/* Right ear */}
          <g
            style={{
              transformOrigin: '185px 65px',
              transition: 'transform 0.4s ease',
              transform:
                state === 'listening'
                  ? 'rotate(12deg) translateY(-4px)'
                  : state === 'speaking'
                    ? 'rotate(3deg)'
                    : 'rotate(0deg)',
              animation:
                state === 'listening'
                  ? 'ear-twitch-right 1.2s ease-in-out infinite'
                  : 'none',
            }}
          >
            <path
              d="M180 80 L205 40 L220 42 L210 55 L198 82"
              fill="#5a5e63"
              stroke="#222"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <path
              d="M185 75 L202 45 L210 47 L200 65 L192 80"
              fill="#7a7e84"
              stroke="none"
            />
          </g>

          {/* === EYEBROWS - bushy and white === */}
          {/* Left eyebrow - jagged/bushy */}
          <path
            d="M95 85 Q100 76 108 78 Q112 74 118 77 Q122 73 127 80 L125 88 Q118 84 112 86 Q106 82 100 87 Z"
            fill="#c8cdd4"
            stroke="#222"
            strokeWidth="2"
          />
          {/* Right eyebrow */}
          <path
            d="M153 80 Q158 73 162 77 Q166 74 172 78 Q178 76 185 85 L180 87 Q174 82 168 86 Q162 84 155 88 Z"
            fill="#c8cdd4"
            stroke="#222"
            strokeWidth="2"
          />

          {/* === EYES === */}
          {/* Left eye */}
          <g>
            <ellipse
              cx="113"
              cy="98"
              rx={blinkOpen ? 7 : 7}
              ry={blinkOpen ? 7 : 1.5}
              fill="#111"
              stroke="#222"
              strokeWidth="1"
              style={{ transition: 'ry 0.1s ease' }}
            />
            {blinkOpen && (
              <circle cx="115" cy="96" r="2.5" fill="white" opacity="0.9" />
            )}
          </g>
          {/* Right eye */}
          <g>
            <ellipse
              cx="167"
              cy="98"
              rx={blinkOpen ? 7 : 7}
              ry={blinkOpen ? 7 : 1.5}
              fill="#111"
              stroke="#222"
              strokeWidth="1"
              style={{ transition: 'ry 0.1s ease' }}
            />
            {blinkOpen && (
              <circle cx="169" cy="96" r="2.5" fill="white" opacity="0.9" />
            )}
          </g>

          {/* === MUZZLE AREA === */}
          {/* Snout base - lighter area */}
          <ellipse cx="140" cy="118" rx="22" ry="14" fill="#7a7e84" stroke="none" />

          {/* NOSE - big and black */}
          <ellipse
            cx="140"
            cy="112"
            rx="12"
            ry="9"
            fill="#111"
            stroke="#222"
            strokeWidth="2"
          />
          {/* Nose shine */}
          <ellipse cx="136" cy="109" rx="4" ry="2.5" fill="#444" opacity="0.6" />

          {/* Mouth line */}
          <path
            d="M140 121 L140 126"
            fill="none"
            stroke="#222"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* === TONGUE (speaking state) === */}
          {state === 'speaking' && (
            <g
              style={{
                animation: 'tongue-pant 0.6s ease-in-out infinite alternate',
              }}
            >
              <ellipse
                cx="145"
                cy="133"
                rx="8"
                ry="12"
                fill="#e85a6b"
                stroke="#222"
                strokeWidth="2"
              />
              <ellipse cx="145" cy="131" rx="5" ry="7" fill="#f07584" opacity="0.5" />
              {/* Center line on tongue */}
              <path
                d="M145 126 Q145 135 145 142"
                fill="none"
                stroke="#d14a5a"
                strokeWidth="1"
              />
            </g>
          )}

          {/* Smile curves */}
          {state !== 'speaking' ? (
            <>
              <path
                d="M128 125 Q134 130 140 126"
                fill="none"
                stroke="#222"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M140 126 Q146 130 152 125"
                fill="none"
                stroke="#222"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </>
          ) : (
            <>
              <path
                d="M124 124 Q132 135 140 130"
                fill="none"
                stroke="#222"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M140 130 Q148 135 156 124"
                fill="none"
                stroke="#222"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </>
          )}

          {/* === BEARD - big, fluffy, jagged, light gray === */}
          <path
            d="M88 118 Q85 128 82 135 Q80 142 85 148 Q90 155 95 150 Q98 158 105 155 Q110 162 118 158 Q125 165 135 160 Q140 168 148 160 Q155 165 162 158 Q170 162 175 155 Q180 158 185 150 Q192 155 195 148 Q200 142 198 135 Q195 128 192 118 Q180 130 165 132 Q155 135 140 135 Q125 135 115 132 Q100 130 88 118 Z"
            fill="#c8cdd4"
            stroke="#222"
            strokeWidth="2.5"
            style={{
              animation:
                state === 'speaking'
                  ? 'beard-wobble 0.8s ease-in-out infinite'
                  : 'none',
            }}
          />
          {/* Beard inner texture */}
          <path d="M110 135 Q112 145 108 152" fill="none" stroke="#dde0e5" strokeWidth="1.5" />
          <path d="M130 138 Q131 148 128 158" fill="none" stroke="#dde0e5" strokeWidth="1.5" />
          <path d="M150 138 Q149 148 152 158" fill="none" stroke="#dde0e5" strokeWidth="1.5" />
          <path d="M168 135 Q167 145 170 152" fill="none" stroke="#dde0e5" strokeWidth="1.5" />

          {/* === WHISKERS === */}
          {/* Left whiskers */}
          <line x1="88" y1="120" x2="58" y2="116" stroke="#8a8e94" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="88" y1="125" x2="55" y2="127" stroke="#8a8e94" strokeWidth="1.5" strokeLinecap="round" />
          {/* Right whiskers */}
          <line x1="192" y1="120" x2="222" y2="116" stroke="#8a8e94" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="192" y1="125" x2="225" y2="127" stroke="#8a8e94" strokeWidth="1.5" strokeLinecap="round" />

          {/* === PAWS (peeking at bottom) === */}
          {/* Left paw */}
          <ellipse cx="115" cy="255" rx="18" ry="10" fill="#5a5e63" stroke="#222" strokeWidth="2.5" />
          <path d="M103 255 Q105 250 109 255" fill="none" stroke="#222" strokeWidth="1.5" />
          <path d="M110 254 Q112 249 115 254" fill="none" stroke="#222" strokeWidth="1.5" />
          {/* Right paw */}
          <ellipse cx="165" cy="255" rx="18" ry="10" fill="#5a5e63" stroke="#222" strokeWidth="2.5" />
          <path d="M159 254 Q161 249 164 254" fill="none" stroke="#222" strokeWidth="1.5" />
          <path d="M165 255 Q167 250 171 255" fill="none" stroke="#222" strokeWidth="1.5" />
        </svg>
      </div>

      {/* State indicator */}
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
