import HeroBackground from '../components/HeroBackground';

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
      className="relative overflow-hidden bg-neutral-950 px-6 pb-24 pt-32 text-white md:px-16"
    >
      {/* Dynamic background layer — swap HeroBackground for anything later */}
      <HeroBackground className="z-0" />

      {/* Translucent front plane */}
      <div className="relative z-10 mx-auto w-[90%] max-w-6xl">
        <div className="border border-white/15 bg-white/5 p-8 backdrop-blur-xl md:p-12">
          <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-[1fr_320px]">
            {/* Left: intro */}
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-neutral-400">
                CS Student · Software Engineering · Game Development
              </p>

              <h1 className="mt-6 font-[Quicksand] text-6xl font-bold leading-[1.05] md:text-7xl">
                Anthony
                <br />
                Qi
              </h1>

              <p className="mt-8 max-w-xl text-lg leading-relaxed text-neutral-300">
                I build software that lives at the intersection of systems
                programming, interactive media, and game development. Currently
                pursuing a double major B.S in Computer Science and Immersive
                Media Design @ The University of Maryland.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <a
                  href="#projects"
                  className="inline-flex items-center gap-2 bg-white px-6 py-3 font-semibold text-neutral-950 transition-opacity hover:opacity-85"
                >
                  View Work
                  <span aria-hidden="true">→</span>
                </a>

                <a
                  href="#contact"
                  className="inline-flex items-center border border-white/40 px-6 py-3 font-semibold text-white transition-colors hover:bg-white hover:text-neutral-950"
                >
                  Get in Touch
                </a>
              </div>
            </div>

            {/* Right: quick facts — nested inside the outer glass panel,
                so it drops its own blur to avoid double blur */}
            <div className="border border-white/10 bg-white/5 p-6">
              <p className="font-mono text-xs uppercase tracking-widest text-neutral-400">
                Quick Facts
              </p>
              <dl className="mt-4 divide-y divide-white/10">
                {QUICK_FACTS.map((fact) => (
                  <div
                    key={fact.label}
                    className="flex items-center justify-between py-2.5"
                  >
                    <dt className="font-mono text-xs text-neutral-400">
                      {fact.label}
                    </dt>
                    <dd className="text-sm font-medium text-white">
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}