interface SectionHeaderProps {
  title: string
  intro?: string
}

function SectionHeader({ title, intro }: SectionHeaderProps) {
  return (
    <header className="mb-10">
      <h1 className="text-3xl font-semibold text-ink">{title}</h1>
      {intro && <p className="mt-3 text-lg text-ink-muted max-w-[60ch]">{intro}</p>}
    </header>
  )
}

export default SectionHeader
