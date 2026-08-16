import { useEffect, useRef, useState } from "react"

interface SectionLabelProps {
  command: string
  onComplete?: () => void
  onReset?: () => void
}

export default function SectionLabel({ command, onComplete, onReset }: SectionLabelProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [typedLength, setTypedLength] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const isActive = useRef(false)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    if (prefersReducedMotion) {
      setTypedLength(command.length)
      onComplete?.()
      return
    }

    const el = ref.current
    if (!el) return

    const clearTyping = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    const startTyping = () => {
      isActive.current = true
      clearTyping()
      let i = 0
      intervalRef.current = setInterval(() => {
        i += 1
        setTypedLength(i)
        if (i >= command.length) {
          clearTyping()
          onComplete?.()
        }
      }, 40)
    }

    const reset = () => {
      isActive.current = false
      clearTyping()
      setTypedLength(0)
      onReset?.()
    }

    const topMargin = Math.round(window.innerHeight * 0.5)
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio > 0 && !isActive.current) {
          startTyping()
        } else if (entry.intersectionRatio === 0 && isActive.current) {
          reset()
        }
      },
      {
        threshold: [0, 1],
        rootMargin: `${topMargin}px 0px 0px 0px`,
      }
    )

    observer.observe(el)
    return () => {
      clearTyping()
      observer.disconnect()
    }
  }, [command])

  const isDone = typedLength >= command.length

  return (
    <div
      ref={ref}
      className="flex items-center gap-2 mb-10 font-mono text-sm tracking-wide lowercase"
      style={{ fontFamily: "'Geist Mono', monospace" }}
    >
      <span className="text-foreground/40">❯</span>
      <span className="flex items-center text-muted-foreground">
        {command.slice(0, typedLength)}
        <span
          className={`inline-block w-[7px] h-[15px] ml-0.5 bg-muted-foreground/50 ${
            isDone ? "animate-pulse" : ""
          }`}
        />
      </span>
    </div>
  )
}