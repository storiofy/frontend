import { Heart, Sparkles } from 'lucide-react';

export default function Logo() {
  return (
    <div className="relative w-9 h-9">
      {/* Creative starburst design representing magic, AI creativity, and personalization */}
      <svg 
        viewBox="0 0 36 36" 
        fill="none" 
        className="w-9 h-9"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer starburst rays - gradient from blue to pink */}
        <path 
          d="M18 0L19.5 8L18 4L16.5 8L18 0Z" 
          fill="url(#grad1)"
        />
        <path 
          d="M18 36L19.5 28L18 32L16.5 28L18 36Z" 
          fill="url(#grad1)"
        />
        <path 
          d="M0 18L8 19.5L4 18L8 16.5L0 18Z" 
          fill="url(#grad2)"
        />
        <path 
          d="M36 18L28 19.5L32 18L28 16.5L36 18Z" 
          fill="url(#grad2)"
        />
        <path 
          d="M6 6L12 12L8 8L12 10L6 6Z" 
          fill="url(#grad3)"
        />
        <path 
          d="M30 30L24 24L28 28L24 26L30 30Z" 
          fill="url(#grad3)"
        />
        <path 
          d="M6 30L12 24L8 28L10 24L6 30Z" 
          fill="url(#grad4)"
        />
        <path 
          d="M30 6L24 12L28 8L26 12L30 6Z" 
          fill="url(#grad4)"
        />
        
        {/* Center star */}
        <circle cx="18" cy="18" r="8" fill="url(#centerGrad)" />
        <circle cx="18" cy="18" r="5" fill="url(#innerGrad)" />
        
        {/* Sparkle accents */}
        <circle cx="18" cy="11" r="1.5" fill="#60A5FA" />
        <circle cx="25" cy="18" r="1.5" fill="#EC4899" />
        <circle cx="18" cy="25" r="1.5" fill="#A78BFA" />
        <circle cx="11" cy="18" r="1.5" fill="#FBBF24" />
        
        {/* Gradient definitions */}
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
          <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#A78BFA" />
            <stop offset="100%" stopColor="#F472B6" />
          </linearGradient>
          <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
          <linearGradient id="grad4" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#A78BFA" />
          </linearGradient>
          <radialGradient id="centerGrad">
            <stop offset="0%" stopColor="#F472B6" />
            <stop offset="100%" stopColor="#60A5FA" />
          </radialGradient>
          <radialGradient id="innerGrad">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="50%" stopColor="#EC4899" />
            <stop offset="100%" stopColor="#60A5FA" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}