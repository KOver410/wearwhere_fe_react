interface WavyDividerProps {
  color?: string;
  flip?: boolean;
  className?: string;
}

export function WavyDivider({ color = '#d41c1c', flip = false, className = '' }: WavyDividerProps) {
  return (
    <div className={`w-full overflow-hidden leading-[0] ${className}`} style={{ transform: flip ? 'rotate(180deg)' : undefined }}>
      <svg viewBox="0 0 1440 20" preserveAspectRatio="none" className="w-full block" style={{ height: '12px' }}>
        <path
          d="M0,10 C120,18 240,2 360,10 C480,18 600,2 720,10 C840,18 960,2 1080,10 C1200,18 1320,2 1440,10"
          stroke={color}
          strokeWidth="2"
          fill="none"
        />
      </svg>
    </div>
  );
}
