import PixelSnow from './PixelSnow';
import './PixelSnow.css';

type SiteBackgroundProps = {
  className?: string;
  theme: 'light' | 'dark';
};

export default function SiteBackground({ className = '', theme }: SiteBackgroundProps) {
  const flakeColor = theme === 'light' ? '#8a8a8a67' : '#fff1f18a';

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
        density={0.125}
        variant="square"
        direction={90}
      />
    </div>
  );
}