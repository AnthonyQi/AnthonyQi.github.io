import { useEffect, useState } from 'react'
import Nav from './components/Nav'
import Hero from './sections/Hero'
import Projects from './sections/Projects'
import GameProjects from './sections/Games'
import Skills from "./sections/Skills"
import Experience from './sections/Experience'
import Resume from './sections/Resume'
import Contact from './sections/Contact'

type Theme = 'light' | 'dark'

function getInitialTheme(): Theme {
  const stored = localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark') return stored

  // fall back to system preference if nothing saved yet
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function App() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  return (
    <div className="relative min-h-screen text-foreground">
      <Nav theme={theme} onToggleTheme={toggleTheme} />
      <Hero />
      <Projects />
      <GameProjects />
      <Skills />
      <Experience />
      <Resume />
      <Contact />
    </div>
  )
}

export default App