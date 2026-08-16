export interface ResumeInfo {
  url: string
  lastUpdated: string
  pages: number
}

export const RESUME: ResumeInfo = {
  url: "/resume.pdf",
  lastUpdated: "[Month Year]",
  pages: 1,
}

//add the resume to public as public/resume.pdf