export default function Loading() {
  return (
    <div className="max-w-container mx-auto px-24 py-80 flex items-center justify-center">
      <div className="flex flex-col items-center gap-16">
        <div className="w-40 h-40 border-2 border-stone/20 border-t-ink rounded-full animate-spin" />
        <p className="font-mono text-[11px] uppercase tracking-widest text-stone">Loading</p>
      </div>
    </div>
  )
}
