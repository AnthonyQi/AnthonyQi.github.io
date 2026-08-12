import { ExternalLink } from 'lucide-react'
import SectionLabel from '../components/SectionLabel'
import StatusPill from '../components/StatusPill'
import GithubIcon from '../components/Github'
import { PROJECTS } from '../data/projects'

export default function Projects() {
  return (
    <section id="projects" className="py-24 px-6 max-w-5xl mx-auto">
      <SectionLabel text="— 02 · Featured Projects" />
      <div className="grid md:grid-cols-2 gap-px bg-border border border-border">
        {PROJECTS.map((p) => (
          <article
            key={p.id}
            className="bg-card/40 backdrop-blur-sm p-7 hover:bg-secondary/60 transition-colors group"
          >
            <div className="flex items-start justify-between mb-4">
              <span
                className="font-mono text-[10px] text-muted-foreground"
                style={{ fontFamily: "'Geist Mono', monospace" }}
              >
                {p.id}
              </span>
              <StatusPill status={p.status} />
            </div>

            <h3
              className="text-lg font-semibold mb-2 leading-snug text-foreground"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              {p.title}
            </h3>

            <p className="text-sm text-muted-foreground leading-relaxed mb-5 font-light">
              {p.description}
            </p>

            <div className="flex flex-wrap gap-1.5 mb-5">
              {p.tags.map((t) => (
                <span
                  key={t}
                  className="font-mono text-[10px] px-2 py-0.5 bg-muted text-muted-foreground"
                  style={{ fontFamily: "'Geist Mono', monospace" }}
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-border opacity-0 group-hover:opacity-100 transition-opacity">
              {p.githubUrl && (
                <a
                  href={p.githubUrl}
                  className="font-mono text-[10px] tracking-wider uppercase text-foreground flex items-center gap-1 hover:underline"
                  style={{ fontFamily: "'Geist Mono', monospace" }}
                >
                  <GithubIcon size={11} /> GitHub
                </a>
              )}
              {p.demoUrl && (
                <a
                  href={p.demoUrl}
                  className="font-mono text-[10px] tracking-wider uppercase text-foreground flex items-center gap-1 hover:underline"
                  style={{ fontFamily: "'Geist Mono', monospace" }}
                >
                  <ExternalLink size={11} /> Demo
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}