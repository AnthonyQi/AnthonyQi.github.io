import { Mail } from "lucide-react"
import Window from "../components/Window"
import GithubIcon from "../components/Github"
import LinkedinIcon from "../components/Linkedin"
import { CONTACT } from "../data/contact"

const ICON_MAP = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
}

export default function Contact() {
  return (
    <section id="contact" className="py-20 px-6 max-w-5xl mx-auto">
      <Window command="cat ./contact.json">
        <div className="grid md:grid-cols-[1fr_auto] gap-12 items-start">
          <div>
            <h2
              className="text-3xl md:text-4xl font-light leading-tight mb-4 text-foreground"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              <span className="font-semibold">Contact Me</span>
            </h2>
            <p className="text-sm text-muted-foreground font-light leading-relaxed max-w-sm mb-8">
              {CONTACT.blurb}
            </p>
            <a
              href={`mailto:${CONTACT.email}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-foreground border-b border-foreground pb-0.5 hover:text-muted-foreground hover:border-muted-foreground transition-colors"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              <Mail size={14} />
              {CONTACT.email}
            </a>
          </div>

          <div className="md:text-right space-y-px w-full md:w-auto">
            <p
              className="font-mono text-[9px] tracking-widest text-muted-foreground uppercase mb-4"
              style={{ fontFamily: "'Geist Mono', monospace" }}
            >
            </p>
            {CONTACT.profiles.map((p) => {
              const Icon = ICON_MAP[p.icon]
              return (
                <a
                  key={p.id}
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex md:flex-row-reverse items-center gap-3 p-3 border border-transparent hover:border-border hover:bg-secondary/40 transition-colors group"
                >
                  <Icon
                    size={14}
                    className="text-muted-foreground group-hover:text-foreground transition-colors"
                  />
                  <div className="md:text-right">
                    <p className="text-sm font-medium text-foreground">{p.label}</p>
                    <p
                      className="font-mono text-[10px] text-muted-foreground"
                      style={{ fontFamily: "'Geist Mono', monospace" }}
                    >
                      {p.handle}
                    </p>
                  </div>
                </a>
              )
            })}
          </div>
        </div>
      </Window>
    </section>
  )
}