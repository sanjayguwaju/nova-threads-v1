'use client'
import { cn } from '@/lib/utils/cn'

interface Props {
  variants: any[]
  selectedColor: string | null
  selectedSize: string | null
  onColorChange: (color: string) => void
  onSizeChange: (size: string) => void
}

export function VariantSelector({ variants, selectedColor, selectedSize, onColorChange, onSizeChange }: Props) {
  const colors = Array.from(
    new Map(variants.map((v) => [v.color, { color: v.color, hex: v.colorHex }])).values()
  )
  const sizesForColor = variants.filter((v) => !selectedColor || v.color === selectedColor)
  const sizes = Array.from(new Map(sizesForColor.map((v) => [v.size, v])).values())

  return (
    <div className="space-y-24">
      {colors.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-12">
            <span className="font-mono text-[11px] uppercase tracking-widest">
              Color{selectedColor ? `: ${selectedColor}` : ''}
            </span>
          </div>
          <div className="flex flex-wrap gap-10">
            {colors.map((c: any) => {
              const hasStock = variants.some((v) => v.color === c.color && (v.stock ?? 0) > 0)
              return (
                <button
                  key={c.color}
                  onClick={() => onColorChange(c.color)}
                  disabled={!hasStock}
                  className={cn(
                    'relative w-32 h-32 rounded-full border-2',
                    selectedColor === c.color ? 'border-ink' : 'border-stone/30',
                    !hasStock && 'opacity-40'
                  )}
                  style={{ background: c.hex || '#ccc' }}
                  title={c.color}
                >
                  {!hasStock && (
                    <span className="absolute inset-0 flex items-center justify-center text-[8px]">×</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-12">
          <span className="font-mono text-[11px] uppercase tracking-widest">Size</span>
          <button className="font-mono text-[11px] uppercase tracking-widest underline">Size Guide</button>
        </div>
        <div className="grid grid-cols-6 gap-6">
          {sizes.map((v: any) => {
            const oos = (v.stock ?? 0) === 0
            return (
              <button
                key={v.size}
                onClick={() => onSizeChange(v.size)}
                disabled={oos}
                className={cn(
                  'border py-10 font-mono text-[11px] relative',
                  selectedSize === v.size ? 'border-ink bg-ink text-paper' : 'border-stone/40',
                  oos && 'opacity-40 line-through cursor-not-allowed'
                )}
              >
                {v.size}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
