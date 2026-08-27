export interface ContactProfile {
  id: string
  label: string
  handle: string
  href: string
  icon: "github" | "linkedin"
}

export interface ContactInfo {
  email: string
  blurb: string
  profiles: ContactProfile[]
}

export const CONTACT: ContactInfo = {
  email: "aqi1@terpmail.umd.edu",
  blurb:
    "Looking for internships, collaborations, projects, etc.",
  profiles: [
    {
      id: "01",
      label: "GitHub",
      handle: "@AnthonyQi",
      href: "https://github.com/AnthonyQi",
      icon: "github",
    },
    {
      id: "02",
      label: "LinkedIn",
      handle: "in/aqi1",
      href: "https://linkedin.com/in/aqi1",
      icon: "linkedin",
    },
  ],
}