export type ProficiencyLevel = "amateur" | "intermediate" | "proficient" | "advanced"

const LEVEL_RANK: Record<ProficiencyLevel, number> = {
  advanced: 3,
  proficient: 2,
  intermediate: 1,
  amateur: 0,
}

export interface Skill {
  name: string
  level: ProficiencyLevel
  since: string
  timeExposedOverride?: string
  description?: string // shown in the flyout panel, optional
}

export interface SkillGroup {
  id: string
  category: string
  skills: Skill[]
}

export function timeExposed(skill: Skill): string {
  if (skill.timeExposedOverride) return skill.timeExposedOverride

  const startYear = parseInt(skill.since, 10)
  const currentYear = new Date().getFullYear()
  const years = currentYear - startYear

  if (years <= 0) return "< 1 year"
  if (years === 1) return "1 year"
  return `${years} years`
}

export function sortedSkills(skills: Skill[]): Skill[] {
  return [...skills].sort((a, b) => LEVEL_RANK[b.level] - LEVEL_RANK[a.level])
}

export const SKILL_GROUPS: SkillGroup[] = [
  {
    id: "01",
    category: "Languages",
    skills: [
      { name: "C", level: "intermediate", since: "2025", description: "First introduced to C by my Intro to Computer Systems Professor. I have finished multiple projects or varying difficulties in C."},
      { name: "Rust", level: "amateur", since: "2026" },
      { name: "OCaml", level: "amateur", since: "2026" },
      { name: "Java", level: "proficient", since: "2019", description: "My first programming language that I started taking classes for before Covid. I have completed various different projects over the years, and some projects currently in progress."},
      { name: "Python", level: "intermediate", since: "2024" },
      { name: "JavaScript", level: "intermediate", since: "2023" },
      { name: "C#", level: "intermediate", since: "2023" },
      { name: "x86-64 Assembly", level: "intermediate", since: "2025" },
      { name: "SQL", level: "intermediate", since: "2023" },
    ],
  },
  {
    id: "02",
    category: "Systems & Concepts",
    skills: [
      { name: "Compilers", level: "intermediate", since: "2026" },
      { name: "Systems Programming", level: "intermediate", since: "2025" },
      { name: "Multithreading", level: "proficient", since: "2025" },
      { name: "Memory Management", level: "proficient", since: "2025" },
      { name: "Garbage Collection", level: "intermediate", since: "2026" },
      { name: "Data Structures & Algorithms", level: "advanced", since: "2020" },
    ],
  },
  {
    id: "03",
    category: "Tools and Environments",
    skills: [
      { name: "Git", level: "proficient", since: "2023" },
      { name: "Bash", level: "amateur", since: "2024" },
      { name: "Linux/Unix", level: "proficient", since: "2025" },
      { name: "GDB", level: "intermediate", since: "2025" },
      { name: "Valgrind", level: "intermediate", since: "2025" },
      { name: "JUnit", level: "proficient", since: "2024" },
    ],
  },
  {
    id: "04",
    category: "Databases & AI",
    skills: [
      { name: "MySQL", level: "intermediate", since: "2023" },
      { name: "Machine Learning", level: "intermediate", since: "2024" },
      { name: "NLP Model Training", level: "amateur", since: "2026" },
      { name: "UnSloth", level: "amateur", since: "2026" },
    ],
  },
]