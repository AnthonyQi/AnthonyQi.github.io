import PixelSnow from './PixelSnow';
import './PixelSnow.css';

type SiteBackgroundProps = {
  className?: string;
  theme: 'light' | 'dark';
};

export default function SiteBackground({ className = '', theme }: SiteBackgroundProps) {
  const flakeColor = theme === 'dark' ? '#ffffff' : '#525252';

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 -z-10 overflow-hidden ${className}`}
    >
      <PixelSnow
        color={flakeColor}
        flakeSize={0.005}
        minFlakeSize={1}
        pixelResolution={325}
        speed={1.25}
        depthFade={8}
        farPlane={20}
        brightness={0.6}
        gamma={0.4545}
        density={0.15}
        variant="square"
        direction={90}
      />

      {/* subtle vignette so the pattern fades toward the edges */}
      <div
        className="absolute inset-0"
        style={{
          background:
            theme === 'dark'
              ? 'radial-gradient(ellipse at center, transparent 0%, rgba(10,10,10,0.6) 85%)'
              : 'radial-gradient(ellipse at center, transparent 0%, rgba(240,240,240,0.6) 85%)',
        }}
      />
    </div>
  );
}