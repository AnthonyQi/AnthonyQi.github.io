import { useState } from "react"
import SectionLabel from "../components/SectionLabel"
import { EXPERIENCE } from "../data/experience"

export default function Experience() {
  const [revealed, setRevealed] = useState(false)

  return (
    <section id="experience" className="py-20 px-6 max-w-5xl mx-auto">
      <SectionLabel
        command="ls ./experience"
        onComplete={() => setRevealed(true)}
        onReset={() => setRevealed(false)}
      />
      <div
        className={`space-y-0 border-l border-border ml-3 transition-all duration-500 ${
          revealed
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-3 pointer-events-none"
        }`}
      >
        {EXPERIENCE.map((e) => (
          <div key={e.id} className="relative pl-8 pb-12 last:pb-0">
            {/* timeline dot */}
            <div className="absolute left-0 top-1 -translate-x-1/2 w-2 h-2 border border-foreground bg-background" />

            <div className="bg-card/40 backdrop-blur-sm p-6 border border-border">
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-3">
                <span
                  className="font-mono text-[9px] tracking-widest text-muted-foreground uppercase bg-muted px-2 py-0.5"
                  style={{ fontFamily: "'Geist Mono', monospace" }}
                >
                  {e.type}
                </span>
                <span
                  className="font-mono text-[10px] text-muted-foreground"
                  style={{ fontFamily: "'Geist Mono', monospace" }}
                >
                  {e.period}
                </span>
              </div>

              <h3
                className="text-base font-semibold leading-snug text-foreground"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                {e.role}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">{e.company}</p>

              <ul className="space-y-2">
                {e.bullets.map((b, j) => (
                  <li
                    key={j}
                    className="flex gap-3 text-sm leading-relaxed font-light text-foreground/80"
                  >
                    <span className="text-muted-foreground mt-0.5 flex-shrink-0">—</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}