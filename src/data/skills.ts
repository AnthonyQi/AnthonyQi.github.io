export interface SkillGroup {
  id: string
  category: string
  icon: "code" | "gamepad" | "layers" | "cpu"
  skills: string[]
}

export const SKILL_GROUPS: SkillGroup[] = [
  {
    id: "01",
    category: "[Category 1]",
    icon: "code",
    skills: ["[Skill 1]", "[Skill 2]", "[Skill 3]", "[Skill 4]", "[Skill 5]"],
  },
  {
    id: "02",
    category: "[Category 2]",
    icon: "gamepad",
    skills: ["[Skill 1]", "[Skill 2]", "[Skill 3]", "[Skill 4]"],
  },
  {
    id: "03",
    category: "[Category 3]",
    icon: "layers",
    skills: ["[Skill 1]", "[Skill 2]", "[Skill 3]", "[Skill 4]"],
  },
  {
    id: "04",
    category: "[Category 4]",
    icon: "cpu",
    skills: ["[Skill 1]", "[Skill 2]", "[Skill 3]", "[Skill 4]"],
  },
]