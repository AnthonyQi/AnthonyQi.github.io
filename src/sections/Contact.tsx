import { useState } from "react"
import { Mail } from "lucide-react"
import SectionLabel from "../components/SectionLabel"
import GithubIcon from "../components/Github"
import LinkedinIcon from "../components/Linkedin"
import { CONTACT } from "../data/contact"

const ICON_MAP = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
}

export default function Contact() {
  const [revealed, setRevealed] = useState(false)

  return (
    <section id="contact" className="py-20 px-6 max-w-5xl mx-auto">
      <SectionLabel
        command="cat ./contact.json"
        onComplete={() => setRevealed(true)}
        onReset={() => setRevealed(false)}
      />
      <div
        className={`grid md:grid-cols-[1fr_auto] gap-12 items-start transition-all duration-500 ${
          revealed
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-3 pointer-events-none"
        }`}
      >
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
            Profiles
          </p>
          {CONTACT.profiles.map((p) => {
            const Icon = ICON_MAP[p.icon]
            return (
              <a
                key={p.id}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex md:flex-row-reverse items-center gap-3 p-3 bg-card/40 backdrop-blur-sm hover:bg-secondary/60 transition-colors group"
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
    </section>
  )
}