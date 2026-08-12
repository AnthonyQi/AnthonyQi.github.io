import { useEffect, useState } from 'react'
import Nav from './components/Nav'
import SiteBackground from './components/SiteBackground'
import Hero from './sections/Hero'
import Projects from './sections/Projects'

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
      <SiteBackground theme={theme} />
      <Nav theme={theme} onToggleTheme={toggleTheme} />
      <Hero />
      <Projects />
    </div>
  )
}

export default App