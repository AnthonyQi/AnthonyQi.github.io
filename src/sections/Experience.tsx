import Window from "../components/Window"
import { EXPERIENCE } from "../data/experience"

export default function Experience() {
  return (
    <section id="experience" className="py-20 px-6 max-w-5xl mx-auto">
      <Window command="ls ./experience">
        <div className="space-y-0 border-l border-border ml-3">
          {EXPERIENCE.map((e) => (
            <div key={e.id} className="relative pl-8 pb-12 last:pb-0">
              {/* timeline dot */}
              <div className="absolute left-0 top-1 -translate-x-1/2 w-2 h-2 border border-foreground bg-background" />

              <div className="p-6 border border-border">
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-3">
                  <span
                    className="font-mono text-[9px] tracking-widest text-muted-foreground uppercase bg-muted px-2 py-0.5"
                  >
                    {e.type}
                  </span>
                  <span
                    className="font-mono text-[10px] text-muted-foreground"
                  >
                    {e.period}
                  </span>
                </div>

                <h3
                  className="text-base font-semibold leading-snug text-foreground"
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
      </Window>
    </section>
  )
}