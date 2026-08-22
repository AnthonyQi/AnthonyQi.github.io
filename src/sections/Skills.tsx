import { useLayoutEffect, useRef, useState } from "react"
import Window from "../components/Window"
import { SKILL_GROUPS, sortedSkills, timeExposed, type Skill, type SkillGroup } from "../data/skills"

const LEVEL_LABEL: Record<Skill["level"], string> = {
  amateur: "Amateur",
  intermediate: "Intermediate",
  proficient: "Proficient",
  advanced: "Advanced",
}

const CARD_WIDTH = "w-56 md:w-64"

interface ActiveState {
  groupId: string
  index: number
}

export default function Skills() {
  const [active, setActive] = useState<ActiveState | null>(null)
  const rowRefs = useRef<Record<string, HTMLLIElement | null>>({})
  const detailCardRef = useRef<HTMLDivElement>(null)
  const [arrowTop, setArrowTop] = useState(0)

  function rowKey(groupId: string, index: number) {
    return `${groupId}-${index}`
  }

  function focusSkill(groupId: string, index: number) {
    setActive({ groupId, index })
  }

  function toggleSkill(groupId: string, index: number) {
    setActive((cur) => (cur?.groupId === groupId && cur?.index === index ? null : { groupId, index }))
  }

  useLayoutEffect(() => {
    if (!active || !detailCardRef.current) return
    const rowEl = rowRefs.current[rowKey(active.groupId, active.index)]
    if (!rowEl) return
    const rowRect = rowEl.getBoundingClientRect()
    const cardRect = detailCardRef.current.getBoundingClientRect()
    setArrowTop(rowRect.top - cardRect.top + rowRect.height / 2)
  }, [active])

  const activeGroup = active ? SKILL_GROUPS.find((g) => g.id === active.groupId) : null
  const activeSkill = activeGroup ? sortedSkills(activeGroup.skills)[active!.index] : null

  return (
    <section id="skills" className="py-20 px-6 w-fit max-w-[85%] mx-auto">
      <Window command="ls ./skills" contentClassName="p-4 md:p-6">
        <div
          className={`flex gap-4 md:gap-6 overflow-x-auto pb-2 ${
            active ? "justify-start" : "[justify-content:safe_center]"
          }`}
        >
          {SKILL_GROUPS.map((group) => {
            const skills = sortedSkills(group.skills)
            const isActiveGroup = active?.groupId === group.id

            return (
              <div key={group.id} className="contents">
                <div className={`${CARD_WIDTH} flex-shrink-0 border border-border p-6`}>
                  <div className="mb-5">
                    <span
                      className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase"
                      style={{ fontFamily: "'Geist Mono', monospace" }}
                    >
                      {group.category}
                    </span>
                  </div>
                  <ul>
                    {skills.map((skill, i) => {
                      const isActive = isActiveGroup && active?.index === i
                      return (
                        <li key={rowKey(group.id, i)} ref={(el) => { rowRefs.current[rowKey(group.id, i)] = el }}>
                          <button
                            type="button"
                            onMouseEnter={() => focusSkill(group.id, i)}
                            onFocus={() => focusSkill(group.id, i)}
                            onClick={() => toggleSkill(group.id, i)}
                            className="flex items-center gap-2 w-[calc(100%+1.5rem)] -ml-6 pl-6 py-1.5 text-left"
                          >
                          <span className="w-1 h-1 bg-muted-foreground/50 rounded-full flex-shrink-0" />
                            <span
                              className={`inline-block origin-left text-sm text-foreground transition-transform duration-150 ${
                                isActive ? "scale-[1.05] font-medium" : ""
                              }`}
                            >
                              {skill.name}
                            </span>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </div>

                {isActiveGroup && activeSkill && (
                  <div
                    ref={detailCardRef}
                    onMouseLeave={() => setActive(null)}
                    className={`${CARD_WIDTH} flex-shrink-0 relative border border-border bg-popover p-6`}
                  >
                    <div
                      className="absolute -left-2 w-0 h-0 border-y-8 border-y-transparent border-r-8 border-r-border"
                      style={{ top: arrowTop - 8 }}
                    />
                    <p
                      className="font-mono text-[10px] tracking-wider uppercase text-muted-foreground mb-1"
                      style={{ fontFamily: "'Geist Mono', monospace" }}
                    >
                      {activeSkill.name} · {LEVEL_LABEL[activeSkill.level]}
                    </p>
                    <p className="text-xs text-muted-foreground mb-3">{timeExposed(activeSkill)}</p>
                    {activeSkill.description && (
                      <p className="text-sm text-foreground/80 leading-relaxed">{activeSkill.description}</p>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </Window>
    </section>
  )
}