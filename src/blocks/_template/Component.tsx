'use client'

interface {{BlockName}}BlockProps {
  title?: string
  content?: string
  // Add more props matching your config fields
}

export function {{BlockName}}Block({
  title = 'Default Title',
  content,
}: {{BlockName}}BlockProps) {
  return (
    <section className="py-16 bg-[var(--color-nt-off-white)]">
      <div className="max-w-container mx-auto px-4 sm:px-8 lg:px-16">
        <h2 className="text-[24px] sm:text-[32px] font-bold tracking-[0.04em] uppercase text-[var(--color-nt-black)]">
          {title}
        </h2>
        {content && (
          <p className="mt-4 text-[var(--color-nt-mid-gray)] text-[14px] sm:text-[15px]">
            {content}
          </p>
        )}
      </div>
    </section>
  )
}
