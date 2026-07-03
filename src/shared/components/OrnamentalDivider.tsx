export function OrnamentalDivider({ className = '', variant = 'default' }: { className?: string; variant?: 'default' | 'light' | 'gold' }) {
  const colors = {
    default: '#d41c1c',
    light: '#e0d8cf',
    gold: '#e2b93b',
  };
  const color = colors[variant];

  return (
    <div className={`flex items-center justify-center gap-4 py-2 ${className}`}>
      <div className="h-px flex-1 max-w-[120px]" style={{ background: `linear-gradient(to right, transparent, ${color})` }} />
      <div className="w-2 h-2 rotate-45" style={{ backgroundColor: color }} />
      <div className="h-px flex-1 max-w-[120px]" style={{ background: `linear-gradient(to left, transparent, ${color})` }} />
    </div>
  );
}

export function SectionDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <div className="h-px flex-1" style={{ background: 'linear-gradient(to right, transparent, #e0d8cf)' }} />
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: '#d41c1c' }} />
        <div className="w-2 h-2 rotate-45" style={{ backgroundColor: '#0d0d0d' }} />
        <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: '#d41c1c' }} />
      </div>
      <div className="h-px flex-1" style={{ background: 'linear-gradient(to left, transparent, #e0d8cf)' }} />
    </div>
  );
}
