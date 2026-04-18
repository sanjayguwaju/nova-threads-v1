export function AnnouncementBar({ text }: { text?: string }) {
  if (!text) return null
  return (
    <div className="bg-ink text-paper py-8 overflow-hidden">
      <div className="font-mono text-[11px] uppercase tracking-widest text-center">{text}</div>
    </div>
  )
}
