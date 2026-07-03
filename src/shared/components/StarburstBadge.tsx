import { motion } from 'motion/react';

interface StarburstBadgeProps {
  text: string;
  size?: number;
  bgColor?: string;
  textColor?: string;
  borderColor?: string;
  rotate?: boolean;
  className?: string;
  fontSize?: string;
}

export function StarburstBadge({
  text,
  size = 120,
  bgColor = '#d41c1c',
  textColor = '#FFFFFF',
  borderColor,
  rotate = false,
  className = '',
  fontSize = '24px',
}: StarburstBadgeProps) {
  const points = 14;
  const outerR = 50;
  const innerR = 36;
  const pathData = Array.from({ length: points * 2 }, (_, i) => {
    const angle = (Math.PI * i) / points - Math.PI / 2;
    const r = i % 2 === 0 ? outerR : innerR;
    const x = 50 + r * Math.cos(angle);
    const y = 50 + r * Math.sin(angle);
    return `${i === 0 ? 'M' : 'L'}${x},${y}`;
  }).join(' ') + 'Z';

  return (
    <motion.div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      animate={rotate ? { rotate: 360 } : undefined}
      transition={rotate ? { duration: 25, repeat: Infinity, ease: 'linear' } : undefined}
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
        <path d={pathData} fill={bgColor} stroke={borderColor || 'none'} strokeWidth={borderColor ? 2 : 0} />
      </svg>
      <motion.span
        className="relative z-10 text-center px-2"
        style={{
          color: textColor,
          fontSize,
          fontFamily: "'Oswald', sans-serif",
          letterSpacing: '0.05em',
          lineHeight: 1.1,
          maxWidth: size * 0.6,
        }}
        animate={rotate ? { rotate: -360 } : undefined}
        transition={rotate ? { duration: 25, repeat: Infinity, ease: 'linear' } : undefined}
      >
        {text}
      </motion.span>
    </motion.div>
  );
}

/* Circle Badge */
export function CircleBadge({
  text,
  size = 80,
  bgColor = '#e2b93b',
  textColor = '#0d0d0d',
  borderColor,
  className = '',
  fontSize = '11px',
}: Omit<StarburstBadgeProps, 'rotate'>) {
  return (
    <div
      className={`inline-flex items-center justify-center rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: bgColor,
        border: borderColor ? `2px solid ${borderColor}` : undefined,
      }}
    >
      <span
        className="text-center px-2 whitespace-pre-line"
        style={{
          color: textColor,
          fontSize,
          fontFamily: "'Oswald', sans-serif",
          letterSpacing: '0.08em',
          lineHeight: 1.1,
          textTransform: 'uppercase',
        }}
      >
        {text}
      </span>
    </div>
  );
}

/* Speech Bubble */
export function SpeechBubble({
  text,
  bgColor = '#fff9f2',
  textColor = '#0d0d0d',
  borderColor = '#0d0d0d',
  className = '',
}: {
  text: string;
  bgColor?: string;
  textColor?: string;
  borderColor?: string;
  className?: string;
}) {
  return (
    <div className={`relative inline-block ${className}`}>
      <div
        className="px-4 py-2"
        style={{
          backgroundColor: bgColor,
          border: `2px solid ${borderColor}`,
          color: textColor,
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '11px',
          fontWeight: 800,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}
      >
        {text}
      </div>
      <div
        className="absolute -bottom-2 left-4 w-3 h-3 rotate-45"
        style={{
          backgroundColor: bgColor,
          borderRight: `2px solid ${borderColor}`,
          borderBottom: `2px solid ${borderColor}`,
        }}
      />
    </div>
  );
}