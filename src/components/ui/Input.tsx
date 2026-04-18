'use client'
import { forwardRef, InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils/cn'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { label, error, className, id, ...rest },
  ref
) {
  const inputId = id || rest.name
  return (
    <div className="flex flex-col gap-4">
      {label && (
        <label htmlFor={inputId} className="font-mono text-[11px] uppercase tracking-widest text-stone">
          {label}
        </label>
      )}
      <input
        id={inputId}
        ref={ref}
        className={cn(
          'w-full bg-transparent border-b border-stone/50 py-12 text-[16px] text-ink placeholder:text-stone/60 focus:outline-none focus:border-ink transition-colors',
          error && 'border-signal',
          className
        )}
        {...rest}
      />
      {error && <span className="text-[12px] text-signal">{error}</span>}
    </div>
  )
})
