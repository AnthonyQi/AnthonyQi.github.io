import { useState } from "react";

import { Gamepad2 } from "lucide-react";

import Window from "../components/Window";

import StatusPill from "../components/StatusPill";

import PachinkoLauncher from "../components/pachinko/PachinkoLauncher";

import { GAME_PROJECTS } from "../data/games";

export default function GameProjects() {
  const [pachinkoOpen, setPachinkoOpen] = useState(false);

  return (
    <section id="games" className="py-20 px-6 max-w-5xl mx-auto">
      <Window command="ls ./game_projects">
        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {GAME_PROJECTS.map((g) => {
            const isPlayable = g.playable === true;

            const cardContent = (
              <>
                <div className="w-full h-36 bg-muted border border-border mb-5 overflow-hidden relative shrink-0">
                  {g.thumbnail ? (
                    <img
                      src={g.thumbnail}
                      alt={g.title}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Gamepad2
                        size={28}
                        className="text-muted-foreground/40"
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-start justify-between mb-3 gap-2">
                  <span
                    className="font-mono text-[9px] tracking-widest text-muted-foreground uppercase"
                    style={{ fontFamily: "'Geist Mono', monospace" }}
                  >
                    {g.genre.join(", ")}
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

                <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
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
              </>
            );

            if (isPlayable) {
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setPachinkoOpen(true)}
                  className="border border-border p-6 hover:border-foreground/40 transition-colors block text-left w-full h-full cursor-pointer appearance-none bg-transparent font-inherit flex flex-col"
                >
                  {cardContent}
                </button>
              );
            }

            if (g.url) {
              return (
                <a
                  key={g.id}
                  href={g.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-border p-6 hover:border-foreground/40 transition-colors block h-full flex flex-col"
                >
                  {cardContent}
                </a>
              );
            }

            return (
              <article
                key={g.id}
                className="border border-border p-6 hover:border-foreground/40 transition-colors block h-full flex flex-col"
              >
                {cardContent}
              </article>
            );
          })}
        </div>
      </Window>

      <PachinkoLauncher
        isOpen={pachinkoOpen}
        onClose={() => setPachinkoOpen(false)}
      />
    </section>
  );
}