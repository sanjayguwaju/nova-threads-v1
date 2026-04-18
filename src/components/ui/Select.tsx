'use client'
import { forwardRef, SelectHTMLAttributes } from 'react'
import { cn } from '@/lib/utils/cn'

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
}

export const Select = forwardRef<HTMLSelectElement, Props>(function Select(
  { label, className, children, id, ...rest },
  ref
) {
  const selectId = id || rest.name
  return (
    <div className="flex flex-col gap-4">
      {label && (
        <label htmlFor={selectId} className="font-mono text-[11px] uppercase tracking-widest text-stone">
          {label}
        </label>
      )}
      <select
        id={selectId}
        ref={ref}
        className={cn(
          'w-full bg-transparent border-b border-stone/50 py-12 text-[16px] text-ink focus:outline-none focus:border-ink',
          className
        )}
        {...rest}
      >
        {children}
      </select>
    </div>
  )
})
