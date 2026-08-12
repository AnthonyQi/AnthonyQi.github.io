import { Gamepad2 } from "lucide-react";
import SectionLabel from "../components/SectionLabel";
import StatusPill from "../components/StatusPill";
import { GAME_PROJECTS } from "../data/games";

export default function GameProjects() {
  return (
    <section id="games" className="py-20 px-6 max-w-5xl mx-auto">
      <SectionLabel text="— 02 · Game Development Projects" />
      <div className="grid md:grid-cols-3 gap-6">
        {GAME_PROJECTS.map((g) => (
          <article
            key={g.id}
            className="border border-border bg-card/40 backdrop-blur-sm p-6 hover:border-foreground/40 transition-colors"
          >
            <div className="w-full h-36 bg-muted border border-border mb-5 flex items-center justify-center">
              <Gamepad2 size={28} className="text-muted-foreground/40" />
            </div>

            <div className="flex items-start justify-between mb-3 gap-2">
              <span
                className="font-mono text-[9px] tracking-widest text-muted-foreground uppercase"
                style={{ fontFamily: "'Geist Mono', monospace" }}
              >
                {g.genre}
              </span>
              <StatusPill status={g.status} />
            </div>

            <h3
              className="text-base font-semibold mb-2 leading-snug"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              {g.title}
            </h3>

            <p className="text-sm text-muted-foreground leading-relaxed mb-4 font-light">
              {g.description}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <span
                className="font-mono text-[10px] text-muted-foreground"
                style={{ fontFamily: "'Geist Mono', monospace" }}
              >
                {g.engine}
              </span>
              <span
                className="font-mono text-[10px] text-muted-foreground"
                style={{ fontFamily: "'Geist Mono', monospace" }}
              >
                {g.team} · {g.duration}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}