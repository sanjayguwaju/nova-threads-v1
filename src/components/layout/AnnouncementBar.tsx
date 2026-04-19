export function AnnouncementBar({ text }: { text?: string }) {
  if (!text) return null
  return (
    <div className="bg-[var(--color-nt-black)] text-[var(--color-nt-white)] py-[10px] overflow-hidden">
      <div className="text-[12px] font-medium uppercase tracking-[0.04em] text-center">{text}</div>
    </div>
  )
}
