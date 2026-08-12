export interface Project {
  id: string
  title: string
  tags: string[]
  description: string
  status: 'Complete' | 'In Progress'
  githubUrl?: string
  demoUrl?: string
}

export const PROJECTS: Project[] = [
  {
    id: '01',
    title: '[Project Title]',
    tags: ['[Language]', '[Framework]', '[Tool]'],
    description:
      '[One to two sentences describing what this project does, the problem it solves, and anything technically interesting about how you built it.]',
    status: 'Complete',
    githubUrl: '#',
    demoUrl: '#',
  },
  {
    id: '02',
    title: '[Project Title]',
    tags: ['[Language]', '[Framework]', '[Tool]'],
    description:
      '[One to two sentences describing what this project does, the problem it solves, and anything technically interesting about how you built it.]',
    status: 'Complete',
    githubUrl: '#',
    demoUrl: '#',
  },
  {
    id: '03',
    title: '[Project Title]',
    tags: ['[Language]', '[Framework]', '[Tool]'],
    description:
      '[One to two sentences describing what this project does, the problem it solves, and anything technically interesting about how you built it.]',
    status: 'In Progress',
    githubUrl: '#',
  },
  {
    id: '04',
    title: '[Project Title]',
    tags: ['[Language]', '[Framework]', '[Tool]'],
    description:
      '[One to two sentences describing what this project does, the problem it solves, and anything technically interesting about how you built it.]',
    status: 'Complete',
    githubUrl: '#',
    demoUrl: '#',
  },
]