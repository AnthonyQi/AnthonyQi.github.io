type HeroBackgroundProps = {
  className?: string;
};

export default function HeroBackground({ className = '' }: HeroBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <div
        className="absolute inset-0 animate-[drift_20s_linear_infinite] opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(255,255,255,0.25) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      {/* subtle vignette so the pattern fades toward the edges */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 0%, rgba(10,10,10,0.6) 85%)',
        }}
      />
    </div>
  );
}