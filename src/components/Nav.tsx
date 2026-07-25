import { useState } from 'react'

const links = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#projects', label: 'Projects' },
  { href: '#art', label: 'Art' },
  { href: '#contact', label: 'Contact' },
]

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
        className="fixed top-8 right-8 z-50 flex flex-col gap-1.5 p-3"
      >
        <span className={`h-0.5 w-6 bg-white transition-all ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
        <span className={`h-0.5 w-6 bg-white transition-all ${isOpen ? 'opacity-0' : ''}`} />
        <span className={`h-0.5 w-6 bg-white transition-all ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
      </button>

      <ul
        className={`fixed top-0 right-0 h-screen w-64 bg-black/80 backdrop-blur-md flex flex-col gap-6 pt-24 px-8 z-40 transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {links.map((link) => {
          return (
            <li key={link.href}>
              <a href={link.href} onClick={() => setIsOpen(false)} className="text-xl text-white hover:text-neutral-400 transition-colors">
                {link.label}
              </a>
            </li>
          )
        })}
      </ul>
    </>
  )
}