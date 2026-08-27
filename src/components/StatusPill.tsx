interface StatusPillProps {
  status: string
}

export default function StatusPill({ status }: StatusPillProps) {
  const isComplete = status === 'Complete'
  return (
    <span
      className={`font-mono text-[10px] tracking-wider uppercase px-2 py-0.5 border ${
        isComplete
          ? 'border-foreground/40 text-foreground/60'
          : 'border-muted-foreground/50 text-muted-foreground'
      }`}
    >
      {status}
    </span>
  )
}