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
      { name: "C", level: "intermediate", since: "2025", description: "First introduced to C by my Intro to Computer Systems Professor. I have finished multiple projects of varying difficulty in C." },
      { name: "Rust", level: "amateur", since: "2026", description: "First exposure to Rust was in my Organization of Programming Languages class, completing one project on garbage collection." },
      { name: "OCaml", level: "amateur", since: "2026", description: "First learned about OCaml through Organization of Programming Languages course, completing various projects." },
      { name: "Java", level: "proficient", since: "2019", description: "My first programming language that I started taking classes for before Covid. I have completed various different projects over the years, with a couple projects currently in progress." },
      { name: "Python", level: "intermediate", since: "2024", description: "My first time utilizing Python was for a Minecraft modding course. After years of Java, I decided to come back to relearn some Python. Currently using Python to help with machine learning and training AI with a DB through Unsloth." },
      { name: "JavaScript", level: "intermediate", since: "2023", description: "Introduced to JS through Khan Academy, eventually attempting to make my personal website." },
      { name: "C#", level: "intermediate", since: "2023", description: "Learned C# through game development. My first time being my participation in CMU's National High School Game Academy, where I spent six weeks building 2 games with 2 different teams. Since then, I have done some game development both in and out of school using Unity with C#." },
      { name: "TypeScript", level: "amateur", since: "2026", description: "Started learning and utilizing TypeScript after switching my personal website from JS to React and TypeScript." },
      { name: "x86-64 Assembly", level: "intermediate", since: "2025", description: "Learned and used ASM for my Intro to Computer Systems course and completed a binary-based battery project. This is pretty much my only time using ASM." },
      { name: "SQL", level: "intermediate", since: "2024", description: "Learned and utilized SQL in high school for a cybersecurity course. Since then, I haven't really used SQL but am attempting to relearn it for a future project in mind." },
    ],
  },
  {
    id: "02",
    category: "Systems & Concepts",
    skills: [
      { name: "Compilers", level: "intermediate", since: "2026", description: "Learned how to build a compiler in OCaml through a college course, understanding how programming languages work through the multiple stages a compiler uses to check for syntax, semantics, and functionality." },
      { name: "Systems Programming", level: "intermediate", since: "2025", description: "Systems programming was definitely hard to grasp at first, but understanding how shells work, or how malloc handles memory, was very intriguing." },
      { name: "Multithreading", level: "proficient", since: "2025", description: "Working across languages like C and Java, I've used multithreading to speed up tasks with large numbers of small, parallelizable operations, improving overall efficiency." },
      { name: "Memory Management", level: "proficient", since: "2025", description: "My first exposure to memory management was through C. Learned to use memory wisely and efficiently. Cleanly disposing of memory after use was also important to understand." },
      { name: "Garbage Collection", level: "intermediate", since: "2026", description: "After learning about memory management, naturally comes learning about how that memory gets wiped. Understanding how garbage collectors work best came through a project in Rust, where it doesn't automatically do the garbage collecting." },
      { name: "Data Structures & Algorithms", level: "advanced", since: "2020", description: "Since my first exposure to Java, I have learned so much about different data structures and algorithms, how and when to use certain algorithms to solve problems, and how and when to use different data structures to build those algorithms." },
    ],
  },
  {
    id: "03",
    category: "Tools and Environments",
    skills: [
      { name: "Git", level: "proficient", since: "2023", description: "Learned about GitHub first at a game development summer program. Naturally learned git in the process of trying to understand GitHub." },
      { name: "Bash", level: "amateur", since: "2024", description: "Learned to use bash in a cybersecurity class, and have since used and learned more about it in my Intro to Computer Systems class." },
      { name: "Linux/Unix", level: "proficient", since: "2025", description: "While learning about systems programming, I came to know about Linux/Unix, eventually building a Unix shell as a project in C." },
      { name: "GDB", level: "intermediate", since: "2025", description: "While working with lower level languages and learning about systems programming, I learned about GDB for debugging. Immensely useful for looking at code, especially line by line, for languages like assembly." },
      { name: "Valgrind", level: "intermediate", since: "2025", description: "Paired with GDB, learning to use Valgrind helped a lot with understanding memory leaks and memory management." },
      { name: "JUnit", level: "proficient", since: "2024", description: "JUnit gave me my first real insight into testing my own code with edge cases and other specific test cases to work through my code." },
    ],
  },
  {
    id: "04",
    category: "Databases & AI",
    skills: [
      { name: "MySQL", level: "intermediate", since: "2023", description: "Learned MySQL in a cybersecurity course, mainly working with schema design and queries. Haven't used it much since, but it's the foundation for how I think about relational data." },
      { name: "Machine Learning", level: "intermediate", since: "2024", description: "Got into ML through Lego robotics as a kid, eventually co-founding ROAR (Robot Open Autonomous Racing) as a club through Berkeley's sponsorship. Most of my experience with machine learning is purely theory right now, though I intend to get more into hands-on work." },
      { name: "NLP Model Training", level: "amateur", since: "2026", description: "Currently fine-tuning an NLP model for intent classification as a Student in Residence at MascotGo. First real hands-on experience with model training outside of coursework." },
      { name: "Unsloth", level: "amateur", since: "2026", description: "Using Unsloth alongside Python to help fine-tune and train models more efficiently as part of my work at MascotGo." },
    ],
  },
]