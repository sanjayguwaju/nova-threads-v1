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

export function AddressForm({ onSubmit, defaults }: { onSubmit: (data: Address) => void; defaults?: Partial<Address> }) {
  const { register, handleSubmit, formState: { errors } } = useForm<Address>({
    resolver: zodResolver(schema),
    defaultValues: defaults,
  })
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-16">
      <div className="grid grid-cols-2 gap-16">
        <Input label="First Name" {...register('firstName')} error={errors.firstName?.message} />
        <Input label="Last Name" {...register('lastName')} error={errors.lastName?.message} />
      </div>
      <Input label="Address Line 1" {...register('line1')} error={errors.line1?.message} />
      <Input label="Address Line 2 (optional)" {...register('line2')} />
      <div className="grid grid-cols-2 gap-16">
        <Input label="City" {...register('city')} error={errors.city?.message} />
        <Input label="State / Province" {...register('state')} error={errors.state?.message} />
      </div>
      <div className="grid grid-cols-2 gap-16">
        <Input label="ZIP / Postal Code" {...register('zip')} error={errors.zip?.message} />
        <Input label="Country" {...register('country')} error={errors.country?.message} />
      </div>
      <Input label="Phone" {...register('phone')} error={errors.phone?.message} />
      <button type="submit" className="w-full bg-ink text-paper font-mono text-[12px] uppercase tracking-widest py-14 hover:bg-noir">
        Continue
      </button>
    </form>
  )
}
