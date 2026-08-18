import Window from "../components/Window";

type QuickFact = {
  label: string;
  value: string;
};

// TODO: confirm "Year" and "Location" — placeholders for now
const QUICK_FACTS: QuickFact[] = [
  { label: 'Year', value: 'Junior, 2027' },
  { label: 'Focus', value: 'SWE · Game Dev' },
  { label: 'Location', value: 'College Park, MD' },
  { label: 'Status', value: 'Open to Roles' },
];

export default function Hero() {
  return (
    <section
      id="home"
      className="relative px-6 pb-24 pt-32 text-foreground md:px-16"
    >
      <div className="relative z-10 mx-auto max-w-7xl">
        <Window>
          <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-[1fr_320px]">
            {/* Left: intro */}
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                CS Student · Software Engineering · Game Development
              </p>
              <h1
                className="mt-6 text-6xl font-bold leading-[1.05] md:text-7xl"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                Anthony Qi
              </h1>
              <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
                I build software that lives at the intersection of systems
                programming, interactive media, and game development. Currently
                pursuing a double major B.S in Computer Science and Immersive
                Media Design @ The University of Maryland.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <a
                  href="#projects"
                  className="inline-flex items-center gap-2 bg-primary px-6 py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-85"
                >
                  View Work
                  <span aria-hidden="true">→</span>
                </a>

                <a
                  href="#contact"
                  className="inline-flex items-center border border-border px-6 py-3 font-semibold text-foreground transition-colors hover:bg-secondary"
                >
                  Get in Touch
                </a>
              </div>
            </div>

            {/* Right: quick facts — nested inside the outer glass window,
                so it drops its own blur to avoid double blur/opacity stacking */}
            <div className="border border-border bg-background/40 p-6">
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Get To Know Me
              </p>
              <dl className="mt-4 divide-y divide-border">
                {QUICK_FACTS.map((fact) => (
                  <div
                    key={fact.label}
                    className="flex items-center justify-between py-2.5"
                  >
                    <dt className="font-mono text-xs text-muted-foreground">
                      {fact.label}
                    </dt>
                    <dd className="text-sm font-medium text-foreground">
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Window>
      </div>
    </section>
  );
}