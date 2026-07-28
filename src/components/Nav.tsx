import { useState } from 'react'

const links = [
  { href: '#projects', label: 'Projects' },
  { href: '#games', label: 'Games' },
  { href: '#skills', label: 'Skills' },
  { href: '#experience', label: 'Experience' },
  { href: '#contact', label: 'Contact' },
]

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 w-full z-50 border-t-2 border-white bg-neutral-950/90 backdrop-blur-sm">
      <div className="flex items-center justify-between px-6 py-4 font-mono text-sm tracking-wider">
        <a href="#home" className="text-white">
          ANTHONY QI / PORTFOLIO
        </a>

        <ul className="hidden md:flex gap-8">
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href}
                className="text-neutral-300 hover:text-white hover:scale-110 transition-all duration-200 uppercase inline-block"
                >
                {link.label}
                </a>
            </li>
          ))}
        </ul>

        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          className="md:hidden text-white uppercase"
        >
          {isOpen ? 'Close' : 'Menu'}
        </button>
      </div>

      {isOpen && (
        <ul className="md:hidden flex flex-col gap-4 px-6 pb-6 font-mono text-sm tracking-wider">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-neutral-300 hover:text-white transition-colors uppercase"
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