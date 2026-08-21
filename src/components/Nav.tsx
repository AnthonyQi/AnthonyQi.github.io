import { useState } from 'react'
import { Moon, Sun } from 'lucide-react'

const links = [
  { href: '#projects', label: 'Projects' },
  { href: '#games', label: 'Games' },
  { href: '#skills', label: 'Skills' },
  { href: '#experience', label: 'Experience' },
  { href: '#contact', label: 'Contact' },
]

type NavProps = {
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}

export default function Nav({ theme, onToggleTheme }: NavProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 w-full z-50 border-t-2 border-border bg-background/75">
      <div className="flex items-center justify-between px-6 py-4 font-mono text-sm tracking-wider">
        <a href="#home" className="text-foreground">
          ANTHONY QI | PORTFOLIO
        </a>

        <div className="flex items-center gap-8">
          <ul className="hidden md:flex gap-8">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground hover:scale-110 transition-transform duration-200 uppercase inline-block"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <button
            onClick={onToggleTheme}
            aria-label="Toggle dark mode"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            className="md:hidden text-foreground uppercase"
          >
            {isOpen ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>

      {isOpen && (
        <ul className="md:hidden flex flex-col gap-4 px-6 pb-6 font-mono text-sm tracking-wider">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors uppercase"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  )
}