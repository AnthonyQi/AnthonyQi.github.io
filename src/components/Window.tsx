import { useState } from "react"
import SectionLabel from "./SectionLabel"

type WindowProps = {
  /** The terminal command shown in the window's title bar, e.g. "ls ./skills".
   *  Omit for a section with no command (e.g. Hero) — content renders immediately,
   *  no title bar at all. */
  command?: string
  children: React.ReactNode
  /** Classes for the outer window frame (border/bg/rounding). */
  className?: string
  /** Classes for the inner content area (e.g. flex/grid layout for that section). */
  contentClassName?: string
}

/**
 * A single "OS window" per section: rounded frame, a title bar with the
 * typed command centered like a terminal window title, and the section's
 * content below, revealed once the command finishes typing.
 *
 * Glass opacity is intentionally different per theme:
 * - dark mode: 75%
 * - light mode: 55%
 * This is the ONLY element in a section that should carry `backdrop-blur` —
 * nested cards inside should stay flat to avoid stacking blur layers.
 */
export default function Window({
  command,
  children,
  className = "",
  contentClassName = "",
}: WindowProps) {
  // no command → nothing to type, content is visible immediately (e.g. Hero)
  const [revealed, setRevealed] = useState(!command)

  return (
    <div
      className={`border border-border bg-card/55 dark:bg-card/75 backdrop-blur-md shadow-lg shadow-black/10 dark:shadow-black/40 [contain:paint] ${className}`}
    >
      {command && (
        <div className="flex items-center px-4 py-3">
          <SectionLabel
            command={command}
            onComplete={() => setRevealed(true)}
            onReset={() => setRevealed(false)}
          />
        </div>
      )}

      <div
        className={`p-8 md:p-10 transition-[opacity,transform] duration-500 ${
          revealed
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-3 pointer-events-none"
        } ${contentClassName}`}
      >
        {children}
      </div>
    </div>
  )
}