export interface ExperienceEntry {
  id: string
  role: string
  company: string
  period: string
  type: string
  bullets: string[]
}

export const EXPERIENCE: ExperienceEntry[] = [
  {
    id: "01",
    role: "[Role Title 1]",
    company: "[Company / Org 1]",
    period: "[Month Year] – [Month Year]",
    type: "[Internship]",
    bullets: [
      "[Bullet describing an accomplishment or responsibility]",
      "[Bullet describing an accomplishment or responsibility]",
      "[Bullet describing an accomplishment or responsibility]",
    ],
  },
  {
    id: "02",
    role: "[Role Title 2]",
    company: "[Company / Org 2]",
    period: "[Month Year] – [Month Year]",
    type: "[Research]",
    bullets: [
      "[Bullet describing an accomplishment or responsibility]",
      "[Bullet describing an accomplishment or responsibility]",
      "[Bullet describing an accomplishment or responsibility]",
    ],
  },
  {
    id: "03",
    role: "[Role Title 3]",
    company: "[Company / Org 3]",
    period: "[Month Year] – Present",
    type: "[Leadership]",
    bullets: [
      "[Bullet describing an accomplishment or responsibility]",
      "[Bullet describing an accomplishment or responsibility]",
      "[Bullet describing an accomplishment or responsibility]",
    ],
  },
  {
    id: "04",
    role: "[Role Title 4]",
    company: "[Company / Org 4]",
    period: "[Month Year] – Present",
    type: "[Leadership]",
    bullets: [
      "[Bullet describing an accomplishment or responsibility]",
      "[Bullet describing an accomplishment or responsibility]",
      "[Bullet describing an accomplishment or responsibility]",
    ],
  },
]