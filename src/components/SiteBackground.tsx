import './SiteBackground.css'

type SiteBackgroundProps = {
  className?: string
  theme?: 'light' | 'dark'
}

export default function SiteBackground({ className = '' }: SiteBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-background ${className}`}
    >
      <div className="absolute inset-0 crt-scanlines" />
    </div>
  )
}