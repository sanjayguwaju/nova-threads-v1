import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center justify-center gap-1 overflow-hidden rounded-[2px] px-[6px] py-[3px] text-[9px] font-bold whitespace-nowrap uppercase tracking-wider leading-[1.2]',
  {
    variants: {
      variant: {
        default: 'bg-[var(--color-nt-black)] text-[var(--color-nt-white)]',
        secondary: 'bg-[var(--color-nt-off-white)] text-[var(--color-nt-black)]',
        destructive: 'bg-[var(--color-nt-sale-red)] text-[var(--color-nt-white)]',
        outline:
          'border border-[var(--color-nt-light-gray)] text-[var(--color-nt-black)] bg-transparent',
        ghost: 'bg-transparent text-[var(--color-nt-mid-gray)]',
        link: 'text-[var(--color-nt-black)] underline-offset-4 hover:underline',
        new: 'bg-[var(--color-nt-badge-blue)] text-[var(--color-nt-white)]',
        sale: 'bg-[var(--color-nt-sale-red)] text-[var(--color-nt-white)]',
        hot: 'bg-[var(--color-nt-badge-hot)] text-[var(--color-nt-white)]',
        stock: 'bg-[var(--color-nt-mid-gray)] text-[var(--color-nt-white)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

function Badge({
  className,
  variant = 'default',
  render,
  ...props
}: useRender.ComponentProps<'span'> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: 'span',
    props: mergeProps<'span'>(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props,
    ),
    render,
    state: {
      slot: 'badge',
      variant,
    },
  })
}

export { Badge, badgeVariants }
