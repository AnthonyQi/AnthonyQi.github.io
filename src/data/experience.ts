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
    role: "Student in Residence",
    company: "MascotGo",
    period: "Jan. 2026 – Present",
    type: "Unpaid Internship",
    bullets: [
      "Fine-tuning a lightweight NLP model using Unsloth on a dataset of 11,000+ labeled queries for intent classification across student support categories.",
      "Collaborating with a cross-functional team to clean and standardize training data, validate model accuracy, and route classified queries to appropriate response tiers.",
    ],
  },
  {
    id: "02",
    role: "Student Game Developer",
    company: "Carnegie Mellon University",
    period: "Jul. 2023 - Aug. 2023",
    type: "Summer Program",
    bullets: [
      "Built a fully playable game prototype in Unity/C# with a multidisciplinary team, integrating original art and audio under sprint-based deadlines.",
      "Presented the final game to CMU faculty and industry professionals at a public showcase.",
    ],
  },
  {
    id: "03",
    role: "Co-Founder & VP",
    company: "ROAR",
    period: "Jan. 2023 - Jun. 2024",
    type: "Leadership",
    bullets: [
      "Co-founded a machine learning club focused on autonomous racing; taught ML concepts through presentations to 20+ members.",
    ],
  },
  {
    id: "04",
    role: "Service Specialist",
    company: "Home Depot",
    period: "Jun. 2025 - Aug. 2025",
    type: "Job",
    bullets: [
      "Handled customer inquiries, returns, and equipment rentals (trucks, vans, carpet cleaners) in a high-volume retail environment.",
    ],
  },
]