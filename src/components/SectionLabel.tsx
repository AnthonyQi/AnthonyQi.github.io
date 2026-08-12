interface SectionLabelProps {
  text: string
}

export default function SectionLabel({ text }: SectionLabelProps) {
  return (
    <div className="flex items-center gap-3 mb-10">
      <span
        className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase"
        style={{ fontFamily: "'Geist Mono', monospace" }}
      >
        {text}
      </span>
      <div className="flex-1 h-px bg-border" />
    </div>
  )
}