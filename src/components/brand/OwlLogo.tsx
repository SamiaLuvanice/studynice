import { cn } from '@/lib/utils';

interface OwlLogoProps {
  className?: string;
  size?: number;
}

export function OwlLogo({ className, size = 36 }: OwlLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("transition-colors", className)}
    >
      {/* Body - main owl shape */}
      <ellipse
        cx="32"
        cy="38"
        rx="22"
        ry="20"
        fill="hsl(var(--primary))"
      />
      
      {/* Belly */}
      <ellipse
        cx="32"
        cy="44"
        rx="14"
        ry="12"
        fill="hsl(var(--primary-foreground))"
        opacity="0.9"
      />
      
      {/* Left ear tuft */}
      <path
        d="M14 20 L20 28 L12 28 Z"
        fill="hsl(var(--primary))"
      />
      
      {/* Right ear tuft */}
      <path
        d="M50 20 L44 28 L52 28 Z"
        fill="hsl(var(--primary))"
      />
      
      {/* Face circle - white background for eyes */}
      <circle
        cx="22"
        cy="32"
        r="10"
        fill="hsl(var(--card))"
      />
      <circle
        cx="42"
        cy="32"
        r="10"
        fill="hsl(var(--card))"
      />
      
      {/* Glasses frames */}
      <circle
        cx="22"
        cy="32"
        r="10"
        strokeWidth="2.5"
        stroke="hsl(var(--foreground))"
        fill="none"
      />
      <circle
        cx="42"
        cy="32"
        r="10"
        strokeWidth="2.5"
        stroke="hsl(var(--foreground))"
        fill="none"
      />
      
      {/* Glasses bridge */}
      <line
        x1="32"
        y1="30"
        x2="32"
        y2="34"
        strokeWidth="2.5"
        stroke="hsl(var(--foreground))"
      />
      
      {/* Glasses arms */}
      <line
        x1="12"
        y1="30"
        x2="6"
        y2="28"
        strokeWidth="2.5"
        strokeLinecap="round"
        stroke="hsl(var(--foreground))"
      />
      <line
        x1="52"
        y1="30"
        x2="58"
        y2="28"
        strokeWidth="2.5"
        strokeLinecap="round"
        stroke="hsl(var(--foreground))"
      />
      
      {/* Eyes - pupils */}
      <circle
        cx="24"
        cy="33"
        r="4"
        fill="hsl(var(--foreground))"
      />
      <circle
        cx="44"
        cy="33"
        r="4"
        fill="hsl(var(--foreground))"
      />
      
      {/* Eye highlights */}
      <circle
        cx="25"
        cy="31"
        r="1.5"
        fill="hsl(var(--card))"
      />
      <circle
        cx="45"
        cy="31"
        r="1.5"
        fill="hsl(var(--card))"
      />
      
      {/* Beak */}
      <path
        d="M32 42 L28 48 L32 52 L36 48 Z"
        fill="hsl(var(--accent-foreground))"
      />
      
      {/* Feet */}
      <ellipse
        cx="26"
        cy="58"
        rx="4"
        ry="2"
        fill="hsl(var(--accent-foreground))"
      />
      <ellipse
        cx="38"
        cy="58"
        rx="4"
        ry="2"
        fill="hsl(var(--accent-foreground))"
      />
    </svg>
  );
}
