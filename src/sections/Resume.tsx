import { Download } from "lucide-react"
import Window from "../components/Window"
import { RESUME } from "../data/resume"

export default function Resume() {
  return (
    <section id="resume" className="py-16 px-6 max-w-5xl mx-auto">
      <Window
        command="download ./resume.pdf"
        contentClassName="flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
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
      </Window>
    </section>
  )
}