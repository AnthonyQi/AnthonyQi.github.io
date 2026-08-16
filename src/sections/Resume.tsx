import { useState } from "react"
import { Download } from "lucide-react"
import SectionLabel from "../components/SectionLabel"
import { RESUME } from "../data/resume"

export default function Resume() {
  const [revealed, setRevealed] = useState(false)

  return (
    <section id="resume" className="py-16 px-6 max-w-5xl mx-auto">
      <SectionLabel
        command="download ./resume.pdf"
        onComplete={() => setRevealed(true)}
        onReset={() => setRevealed(false)}
      />
      <div
        className={`border border-border bg-card/40 backdrop-blur-sm p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all duration-500 ${
          revealed
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-3 pointer-events-none"
        }`}
      >
        <div>
          <h2
            className="text-2xl font-semibold text-foreground"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Download my resume
          </h2>
          <p className="text-sm text-muted-foreground mt-1 font-light">
            Last updated {RESUME.lastUpdated} · PDF, {RESUME.pages} page
            {RESUME.pages > 1 ? "s" : ""}
          </p>
        </div>
        <a
          href={RESUME.url}
          download
          className="inline-flex items-center gap-2 bg-foreground text-primary-foreground px-6 py-3 text-sm font-medium hover:bg-foreground/80 transition-colors flex-shrink-0"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          <Download size={14} />
          Download Resume
        </a>
      </div>
    </section>
  )
}