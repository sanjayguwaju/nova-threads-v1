'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/Input'

const schema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  line1: z.string().min(1, 'Required'),
  line2: z.string().optional(),
  city: z.string().min(1, 'Required'),
  state: z.string().min(1, 'Required'),
  zip: z.string().min(1, 'Required'),
  country: z.string().min(1, 'Required'),
  phone: z.string().min(1, 'Required'),
})

export type Address = z.infer<typeof schema>

function FormField({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1">
      <label className="block text-[13px] font-medium text-[var(--color-nt-black)]">{label}</label>
      {children}
      {error && <p className="text-[12px] text-red-500">{error}</p>}
    </div>
  )
}

export function AddressForm({
  onSubmit,
  defaults,
}: {
  onSubmit: (data: Address) => void
  defaults?: Partial<Address>
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Address>({
    resolver: zodResolver(schema),
    defaultValues: defaults,
  })
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField label="First Name *" error={errors.firstName?.message}>
          <Input {...register('firstName')} aria-invalid={!!errors.firstName} />
        </FormField>
        <FormField label="Last Name *" error={errors.lastName?.message}>
          <Input {...register('lastName')} aria-invalid={!!errors.lastName} />
        </FormField>
      </div>
      <FormField label="Address Line 1 *" error={errors.line1?.message}>
        <Input {...register('line1')} aria-invalid={!!errors.line1} />
      </FormField>
      <FormField label="Address Line 2 (optional)" error={errors.line2?.message}>
        <Input {...register('line2')} />
      </FormField>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="City *" error={errors.city?.message}>
          <Input {...register('city')} aria-invalid={!!errors.city} />
        </FormField>
        <FormField label="State / Province *" error={errors.state?.message}>
          <Input {...register('state')} aria-invalid={!!errors.state} />
        </FormField>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="ZIP / Postal Code *" error={errors.zip?.message}>
          <Input {...register('zip')} aria-invalid={!!errors.zip} />
        </FormField>
        <FormField label="Country *" error={errors.country?.message}>
          <Input {...register('country')} aria-invalid={!!errors.country} />
        </FormField>
      </div>
      <FormField label="Phone *" error={errors.phone?.message}>
        <Input {...register('phone')} aria-invalid={!!errors.phone} />
      </FormField>
      <button
        type="submit"
        className="w-full bg-[var(--color-nt-black)] text-[var(--color-nt-white)] text-[13px] font-semibold uppercase tracking-wider py-3 mt-4 hover:bg-[var(--color-nt-charcoal)] transition-colors cursor-pointer"
      >
        Continue
      </button>
    </form>
  )
}
