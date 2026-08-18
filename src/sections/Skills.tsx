import { Code2, Gamepad2, Layers, Cpu } from "lucide-react"
import Window from "../components/Window"
import { SKILL_GROUPS, type SkillGroup } from "../data/skills"

const ICON_MAP: Record<SkillGroup["icon"], typeof Code2> = {
  code: Code2,
  gamepad: Gamepad2,
  layers: Layers,
  cpu: Cpu,
}
/*
TODO: make sure to implement a way to hover over skills later and be able to describe
my experience in like 1 sentence
*/
export default function Skills() {
  return (
    <section id="skills" className="py-20 px-6 max-w-5xl mx-auto">
      <Window command="ls ./skills" contentClassName="p-0 md:p-0">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-px bg-border">
          {SKILL_GROUPS.map((group) => {
            const Icon = ICON_MAP[group.icon]
            return (
              <div key={group.id} className="bg-card/20 p-6">
                <div className="flex items-center gap-2 mb-5">
                  <Icon size={14} className="text-muted-foreground" />
                  <span
                    className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase"
                    style={{ fontFamily: "'Geist Mono', monospace" }}
                  >
                    {group.category}
                  </span>
                </div>
                <ul className="space-y-2">
                  {group.skills.map((skill, i) => (
                    <li key={`${group.id}-${i}`} className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-muted-foreground/50 rounded-full flex-shrink-0" />
                      <span className="text-sm text-foreground">{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </Window>
    </section>
  )
}