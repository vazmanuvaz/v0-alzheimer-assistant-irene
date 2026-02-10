'use client';

import { useEffect, useState } from 'react';

type AvatarState = 'idle' | 'listening' | 'speaking';

interface SchnauzerAvatarProps {
  state: AvatarState;
}

export function SchnauzerAvatar({ state }: SchnauzerAvatarProps) {
  const [blinkOpen, setBlinkOpen] = useState(true);

  useEffect(() => {
    if (state !== 'idle') {
      setBlinkOpen(true);
      return;
    }
    const interval = setInterval(() => {
      setBlinkOpen(false);
      setTimeout(() => setBlinkOpen(true), 160);
    }, 3200);
    return () => clearInterval(interval);
  }, [state]);

  return (
    <div className="relative w-72 h-72">
      {/* Glow ring for active states */}
      <div
        className="absolute -inset-3 rounded-full transition-all duration-700"
        style={{
          background:
            state === 'listening'
              ? 'radial-gradient(circle, rgba(59,130,246,0.2) 50%, transparent 70%)'
              : state === 'speaking'
                ? 'radial-gradient(circle, rgba(34,197,94,0.2) 50%, transparent 70%)'
                : 'transparent',
          animation:
            state !== 'idle' ? 'pulse-glow 2s ease-in-out infinite' : 'none',
        }}
      />

      <div
        className="relative w-full h-full rounded-full overflow-hidden flex items-center justify-center"
        style={{
          background:
            'radial-gradient(circle at 48% 42%, #edf1f7 0%, #dfe5ee 60%, #ced8e6 100%)',
        }}
      >
        {/*
          SVG traced from the sticker reference:
          - Schnauzer peeking over a line
          - Bold black outlines, flat fills
          - Dark gray body, lighter gray inside ears/chest
          - Jagged light eyebrows, big black nose, jagged fluffy beard
          - Red zigzag collar with gold tag
          - Paws resting on a horizontal line
        */}
        <svg
          viewBox="50 20 180 230"
          className="w-[92%] h-[92%]"
          style={{ marginTop: '8%' }}
        >
          {/* ========= BODY / TORSO ========= */}
          <path
            d="M95 158 Q93 145 105 138 L173 138 Q185 145 183 158 L183 210 Q183 228 140 228 Q97 228 95 210 Z"
            fill="#5c6068"
            stroke="#1a1a1a"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          {/* Chest lighter patch */}
          <path
            d="M118 145 Q140 140 162 145 L158 195 Q140 200 122 195 Z"
            fill="#98a0aa"
            stroke="none"
          />
          {/* Chest fur lines */}
          <path d="M132 150 Q133 170 130 188" fill="none" stroke="#b0b7c0" strokeWidth="1.2" />
          <path d="M148 149 Q147 168 150 186" fill="none" stroke="#b0b7c0" strokeWidth="1.2" />

          {/* ========= COLLAR ========= */}
          {/* Red collar band */}
          <path
            d="M100 140 Q140 130 180 140 L180 150 Q140 140 100 150 Z"
            fill="#cc2828"
            stroke="#1a1a1a"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* Collar zigzag pattern */}
          <path
            d="M108 143 L114 148 L120 143 L126 148 L132 143 L138 148 L144 143 L150 148 L156 143 L162 148 L168 143 L174 148"
            fill="none"
            stroke="#1a1a1a"
            strokeWidth="1.5"
          />
          {/* Gold tag */}
          <ellipse cx="140" cy="155" rx="6" ry="7" fill="#daa520" stroke="#1a1a1a" strokeWidth="2" />
          <circle cx="140" cy="154" r="2" fill="#c49418" />

          {/* ========= HEAD ========= */}
          {/* Main head shape */}
          <path
            d="M83 100 Q80 72 100 58 Q120 48 140 48 Q160 48 180 58 Q198 72 195 100 Q198 120 190 130 Q170 145 140 145 Q110 145 90 130 Q82 120 83 100 Z"
            fill="#5c6068"
            stroke="#1a1a1a"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          {/* Lighter forehead */}
          <ellipse cx="140" cy="72" rx="28" ry="15" fill="#6d737a" stroke="none" />

          {/* Head side fur - left jagged edge */}
          <path
            d="M83 95 Q78 88 80 82 Q76 90 78 96 Q74 102 80 108 Q76 112 83 118"
            fill="#5c6068"
            stroke="#1a1a1a"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Head side fur - right jagged edge */}
          <path
            d="M195 95 Q200 88 198 82 Q202 90 200 96 Q204 102 198 108 Q202 112 195 118"
            fill="#5c6068"
            stroke="#1a1a1a"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* ========= EARS ========= */}
          {/* Left ear - V shape, folds down */}
          <g
            style={{
              transformOrigin: '100px 58px',
              animation:
                state === 'listening'
                  ? 'ear-twitch-left 1s ease-in-out infinite'
                  : 'none',
            }}
          >
            {/* Outer ear */}
            <path
              d="M100 62 L78 28 L68 32 L75 48 L88 68"
              fill="#5c6068"
              stroke="#1a1a1a"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            {/* Inner ear (lighter) */}
            <path
              d="M96 60 L82 34 L76 37 L82 52 L92 66"
              fill="#7d838b"
              stroke="none"
            />
          </g>

          {/* Right ear - V shape, folds down */}
          <g
            style={{
              transformOrigin: '180px 58px',
              animation:
                state === 'listening'
                  ? 'ear-twitch-right 1s ease-in-out infinite'
                  : 'none',
            }}
          >
            <path
              d="M180 62 L200 28 L210 32 L203 48 L192 68"
              fill="#5c6068"
              stroke="#1a1a1a"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            <path
              d="M184 60 L198 34 L204 37 L198 52 L190 66"
              fill="#7d838b"
              stroke="none"
            />
          </g>

          {/* Top of head fur tufts between ears */}
          <path
            d="M105 55 Q108 48 114 52 Q118 46 124 50 Q128 44 134 50 Q138 46 142 50 Q146 44 152 50 Q156 46 160 52 Q164 48 170 55"
            fill="#5c6068"
            stroke="#1a1a1a"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* ========= EYEBROWS ========= */}
          {/* Left eyebrow - jagged bushy, light gray */}
          <path
            d="M93 82 Q98 73 106 76 Q110 72 116 75 Q120 70 126 77 L124 84 Q118 80 112 83 Q106 78 98 84 Z"
            fill="#c4cad2"
            stroke="#1a1a1a"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Right eyebrow */}
          <path
            d="M152 77 Q156 70 162 75 Q166 72 172 76 Q178 73 185 82 L180 84 Q174 78 168 83 Q162 80 155 84 Z"
            fill="#c4cad2"
            stroke="#1a1a1a"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* ========= EYES ========= */}
          {/* Left eye */}
          <ellipse
            cx="112"
            cy="95"
            rx="6.5"
            ry={blinkOpen ? 6.5 : 1.5}
            fill="#111"
            style={{ transition: 'ry 0.12s ease' }}
          />
          {blinkOpen && (
            <circle cx="114" cy="93" r="2" fill="white" opacity="0.85" />
          )}

          {/* Right eye */}
          <ellipse
            cx="168"
            cy="95"
            rx="6.5"
            ry={blinkOpen ? 6.5 : 1.5}
            fill="#111"
            style={{ transition: 'ry 0.12s ease' }}
          />
          {blinkOpen && (
            <circle cx="170" cy="93" r="2" fill="white" opacity="0.85" />
          )}

          {/* ========= NOSE ========= */}
          <ellipse
            cx="140"
            cy="108"
            rx="12"
            ry="9"
            fill="#111"
            stroke="#1a1a1a"
            strokeWidth="2"
          />
          {/* Nose highlight */}
          <ellipse cx="136" cy="105" rx="4" ry="2" fill="#3a3a3a" opacity="0.6" />

          {/* Mouth line down from nose */}
          <path
            d="M140 117 L140 122"
            fill="none"
            stroke="#1a1a1a"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Smile curves */}
          {state !== 'speaking' ? (
            <>
              <path d="M130 121 Q135 126 140 122" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
              <path d="M140 122 Q145 126 150 121" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
            </>
          ) : (
            <>
              <path d="M126 120 Q133 130 140 126" fill="none" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M140 126 Q147 130 154 120" fill="none" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" />
            </>
          )}

          {/* ========= TONGUE (speaking) ========= */}
          {state === 'speaking' && (
            <g
              style={{
                animation: 'tongue-pant 0.5s ease-in-out infinite alternate',
                transformOrigin: '143px 126px',
              }}
            >
              <ellipse cx="143" cy="133" rx="7" ry="10" fill="#e06070" stroke="#1a1a1a" strokeWidth="2" />
              <path d="M143 126 Q143 133 143 140" fill="none" stroke="#c85060" strokeWidth="1" />
            </g>
          )}

          {/* ========= BEARD ========= */}
          {/* Big fluffy jagged beard - the main characteristic */}
          <path
            d="M85 112
               Q82 122 80 130
               Q78 138 82 144
               Q86 150 92 146
               Q95 154 102 150
               Q108 158 116 153
               Q122 162 132 156
               Q138 164 146 156
               Q152 162 160 153
               Q168 158 174 150
               Q180 154 186 146
               Q192 150 196 144
               Q200 138 198 130
               Q196 122 193 112
               Q180 126 168 128
               Q155 132 140 132
               Q125 132 112 128
               Q100 126 85 112 Z"
            fill="#c4cad2"
            stroke="#1a1a1a"
            strokeWidth="3"
            strokeLinejoin="round"
            style={{
              animation:
                state === 'speaking'
                  ? 'beard-wobble 0.7s ease-in-out infinite'
                  : 'none',
            }}
          />
          {/* Beard fur texture */}
          <path d="M105 130 Q107 140 104 148" fill="none" stroke="#d8dce2" strokeWidth="1.2" />
          <path d="M125 133 Q126 143 123 154" fill="none" stroke="#d8dce2" strokeWidth="1.2" />
          <path d="M140 134 Q140 145 140 155" fill="none" stroke="#d8dce2" strokeWidth="1.2" />
          <path d="M155 133 Q154 143 157 154" fill="none" stroke="#d8dce2" strokeWidth="1.2" />
          <path d="M173 130 Q172 140 175 148" fill="none" stroke="#d8dce2" strokeWidth="1.2" />

          {/* ========= WHISKERS ========= */}
          <line x1="85" y1="114" x2="60" y2="110" stroke="#8a8f96" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="84" y1="120" x2="56" y2="122" stroke="#8a8f96" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="193" y1="114" x2="218" y2="110" stroke="#8a8f96" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="194" y1="120" x2="222" y2="122" stroke="#8a8f96" strokeWidth="1.5" strokeLinecap="round" />

          {/* ========= HORIZONTAL LINE (peeking over) ========= */}
          <line
            x1="55"
            y1="225"
            x2="225"
            y2="225"
            stroke="#1a1a1a"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* ========= PAWS on line ========= */}
          {/* Left paw */}
          <ellipse cx="115" cy="224" rx="16" ry="8" fill="#5c6068" stroke="#1a1a1a" strokeWidth="2.5" />
          <path d="M105 224 Q107 219 110 224" fill="none" stroke="#1a1a1a" strokeWidth="1.5" />
          <path d="M112 223 Q114 218 117 223" fill="none" stroke="#1a1a1a" strokeWidth="1.5" />
          <path d="M119 224 Q121 219 124 224" fill="none" stroke="#1a1a1a" strokeWidth="1.5" />

          {/* Right paw */}
          <ellipse cx="165" cy="224" rx="16" ry="8" fill="#5c6068" stroke="#1a1a1a" strokeWidth="2.5" />
          <path d="M155 224 Q157 219 160 224" fill="none" stroke="#1a1a1a" strokeWidth="1.5" />
          <path d="M162 223 Q164 218 167 223" fill="none" stroke="#1a1a1a" strokeWidth="1.5" />
          <path d="M169 224 Q171 219 174 224" fill="none" stroke="#1a1a1a" strokeWidth="1.5" />
        </svg>
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
