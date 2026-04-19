'use client'

import { useState, useMemo, useEffect } from 'react'
import {
  Heart,
  Minus,
  Plus,
  Ruler,
  Share2,
  HelpCircle,
  ChevronDown,
  Check,
  Eye,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { formatCurrency } from '@/lib/utils/formatCurrency'
import { useCartStore } from '@/store/useCartStore'
import { useWishlistStore } from '@/store/useWishlistStore'
import { useUIStore } from '@/store/useUIStore'
import { cn } from '@/lib/utils'

// Countdown Timer Component
function CountdownTimer() {
  const [time, setTime] = useState({ days: 256, hours: 8, mins: 25, secs: 44 })

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => {
        let { days, hours, mins, secs } = prev
        secs--
        if (secs < 0) {
          secs = 59
          mins--
        }
        if (mins < 0) {
          mins = 59
          hours--
        }
        if (hours < 0) {
          hours = 23
          days--
        }
        if (days < 0) {
          days = 0
          hours = 0
          mins = 0
          secs = 0
        }
        return { days, hours, mins, secs }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const pad = (n: number) => n.toString().padStart(2, '0')

  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2 bg-[var(--color-nt-off-white)] rounded-full px-4 sm:px-6 py-2 sm:py-3 w-fit">
      <div className="text-center">
        <div className="text-[18px] sm:text-[24px] font-bold text-[var(--color-nt-black)] tabular-nums">
          {pad(time.days)}
        </div>
        <div className="text-[9px] sm:text-[10px] text-[var(--color-nt-mid-gray)] uppercase">
          Days
        </div>
      </div>
      <span className="text-[var(--color-nt-mid-gray)] text-[14px] sm:text-[18px]">:</span>
      <div className="text-center">
        <div className="text-[18px] sm:text-[24px] font-bold text-[var(--color-nt-black)] tabular-nums">
          {pad(time.hours)}
        </div>
        <div className="text-[9px] sm:text-[10px] text-[var(--color-nt-mid-gray)] uppercase">
          Hours
        </div>
      </div>
      <span className="text-[var(--color-nt-mid-gray)] text-[14px] sm:text-[18px]">:</span>
      <div className="text-center">
        <div className="text-[18px] sm:text-[24px] font-bold text-[var(--color-nt-black)] tabular-nums">
          {pad(time.mins)}
        </div>
        <div className="text-[9px] sm:text-[10px] text-[var(--color-nt-mid-gray)] uppercase">
          Mins
        </div>
      </div>
      <span className="text-[var(--color-nt-mid-gray)] text-[14px] sm:text-[18px]">:</span>
      <div className="text-center">
        <div className="text-[18px] sm:text-[24px] font-bold text-[var(--color-nt-black)] tabular-nums">
          {pad(time.secs)}
        </div>
        <div className="text-[9px] sm:text-[10px] text-[var(--color-nt-mid-gray)] uppercase">
          Secs
        </div>
      </div>
    </div>
  )
}

export function ProductInfo({ product }: { product: any }) {
  const variants = product.variants || []
  const [color, setColor] = useState<string | null>(variants[0]?.color || null)
  const [size, setSize] = useState<string | null>(null)
  const [qty, setQty] = useState(1)
  const [isClient, setIsClient] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const selectedVariant = useMemo(
    () => variants.find((v: any) => v.color === color && v.size === size),
    [variants, color, size],
  )

  const displayVariant =
    selectedVariant || variants.find((v: any) => v.color === color) || variants[0]
  const price = displayVariant?.price ?? 0
  const compareAt = displayVariant?.compareAtPrice
  const onSale = compareAt && compareAt > price
  const stock = selectedVariant?.stock ?? 0

  // Extract unique colors and sizes from variants
  const colors = useMemo(() => {
    const colorMap = new Map()
    variants.forEach((v: any) => {
      if (!colorMap.has(v.color)) {
        colorMap.set(v.color, { name: v.color, hex: v.colorHex || '#ccc' })
      }
    })
    return Array.from(colorMap.values())
  }, [variants])

  const sizes = useMemo(() => {
    const sizeSet = new Set(variants.map((v: any) => v.size).filter(Boolean))
    return Array.from(sizeSet) as string[]
  }, [variants])

  const { addItem } = useCartStore()
  const { has, toggle } = useWishlistStore()
  const { openCart, pushToast } = useUIStore()
  const wished = isClient ? has(product.id) : false

  const mainImg = product.mainImage?.sizes?.card?.url || product.mainImage?.url

  const handleAdd = () => {
    if (!agreedToTerms) {
      pushToast({ type: 'error', message: 'Please agree to Terms & Conditions' })
      return
    }
    if (!selectedVariant) {
      pushToast({ type: 'error', message: 'Select a size' })
      return
    }
    if (stock === 0) {
      pushToast({ type: 'error', message: 'Out of stock' })
      return
    }
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: mainImg || '',
      variantSku: selectedVariant.sku,
      variantLabel: `${selectedVariant.color} / ${selectedVariant.size}`,
      price,
      compareAtPrice: compareAt,
      quantity: qty,
      maxStock: stock,
    })
    openCart()
    pushToast({ type: 'success', message: 'Added to cart' })
  }

  const handleBuyNow = () => {
    if (!agreedToTerms) {
      pushToast({ type: 'error', message: 'Please agree to Terms & Conditions' })
      return
    }
    handleAdd()
    // Navigate to checkout
    window.location.href = '/checkout'
  }

  // Calculate stock percentage for progress bar
  const stockPercentage = Math.min(100, Math.max(5, (stock / 20) * 100))
  const isLowStock = stock > 0 && stock < 10

  return (
    <motion.div
      className="space-y-4 sm:space-y-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      {/* Product Name */}
      <h1 className="text-[20px] sm:text-[24px] font-semibold leading-tight text-[var(--color-nt-black)]">
        {product.name}
      </h1>

      {/* Vendor & Availability */}
      <div className="space-y-1 text-[13px] text-[var(--color-nt-mid-gray)]">
        <p>
          Vendor:{' '}
          <span className="text-[var(--color-nt-black)]">{product.vendor || 'NOVA THREADS'}</span>
        </p>
        <p>
          Availability:{' '}
          <span
            className={cn(
              'font-medium',
              stock > 0 ? 'text-green-600' : 'text-[var(--color-nt-sale-red)]',
            )}
          >
            {stock > 0 ? 'In stock' : 'Out of stock'}
          </span>
        </p>
      </div>

      {/* Price */}
      <div className="text-[22px] sm:text-[26px] font-semibold text-[var(--color-nt-black)]">
        {formatCurrency(price)}
      </div>

      {/* Flash Sale Countdown */}
      <div className="space-y-2">
        <p className="text-[12px] text-[var(--color-nt-mid-gray)]">Hurry up! Limited time offer:</p>
        <CountdownTimer />
      </div>

      {/* Color Selector */}
      {colors.length > 0 && (
        <div className="space-y-2">
          <p className="text-[14px] text-[var(--color-nt-black)]">
            Color: <span className="font-medium">{color || 'Select'}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {colors.map((c: any) => (
              <button
                key={c.name}
                onClick={() => setColor(c.name)}
                className={cn(
                  'w-10 h-10 sm:w-12 sm:h-12 border-2 transition-all',
                  color === c.name
                    ? 'border-[var(--color-nt-black)] ring-1 ring-[var(--color-nt-black)]'
                    : 'border-[var(--color-nt-light-gray)] hover:border-[var(--color-nt-mid-gray)]',
                )}
                style={{ background: c.hex }}
                aria-label={`Select color ${c.name}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Size Selector */}
      {sizes.length > 0 && (
        <div className="space-y-2">
          <p className="text-[14px] text-[var(--color-nt-black)]">Size:</p>
          <div className="flex flex-wrap gap-2">
            {sizes.map((s: string) => (
              <button
                key={s}
                onClick={() => setSize(s === size ? null : s)}
                className={cn(
                  'min-w-[40px] sm:min-w-[48px] h-10 sm:h-12 px-3 border text-[13px] font-medium transition-all',
                  size === s
                    ? 'border-[var(--color-nt-black)] bg-[var(--color-nt-black)] text-[var(--color-nt-white)]'
                    : 'border-[var(--color-nt-light-gray)] text-[var(--color-nt-mid-gray)] hover:border-[var(--color-nt-black)] hover:text-[var(--color-nt-black)]',
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Urgency Message with Progress Bar */}
      {isLowStock && (
        <div className="space-y-2">
          <p className="text-[14px] sm:text-[15px] text-[var(--color-nt-sale-red)] font-medium">
            Hurry up! Only {stock} left
          </p>
          <div className="h-2 bg-[var(--color-nt-light-gray)] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[var(--color-nt-sale-red)] to-green-400 rounded-full transition-all duration-500"
              style={{ width: `${stockPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Action Links */}
      <div className="space-y-2 py-2">
        <button className="flex items-center gap-3 text-[13px] text-[var(--color-nt-black)] hover:text-[var(--color-nt-mid-gray)] transition-colors w-full">
          <Ruler size={18} strokeWidth={1.5} />
          Size chart
        </button>
        <button className="flex items-center gap-3 text-[13px] text-[var(--color-nt-black)] hover:text-[var(--color-nt-mid-gray)] transition-colors w-full">
          <Eye size={18} strokeWidth={1.5} />
          Compare color
        </button>
        <button className="flex items-center gap-3 text-[13px] text-[var(--color-nt-black)] hover:text-[var(--color-nt-mid-gray)] transition-colors w-full">
          <HelpCircle size={18} strokeWidth={1.5} />
          Ask an expert
        </button>
      </div>

      {/* Quantity */}
      <div className="space-y-2">
        <p className="text-[14px] text-[var(--color-nt-black)]">Quantity:</p>
        <div className="flex items-center border border-[var(--color-nt-light-gray)] w-fit">
          <button
            onClick={() => setQty(Math.max(1, qty - 1))}
            className="w-10 h-10 flex items-center justify-center text-[var(--color-nt-mid-gray)] hover:text-[var(--color-nt-black)] transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus size={14} strokeWidth={1.5} />
          </button>
          <span className="w-10 text-center text-[14px] font-medium text-[var(--color-nt-black)]">
            {qty}
          </span>
          <button
            onClick={() => setQty(qty + 1)}
            className="w-10 h-10 flex items-center justify-center text-[var(--color-nt-mid-gray)] hover:text-[var(--color-nt-black)] transition-colors"
            aria-label="Increase quantity"
          >
            <Plus size={14} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Subtotal */}
      <div className="text-[14px] text-[var(--color-nt-black)]">
        Product subtotal: <span className="font-semibold">{formatCurrency(price * qty)}</span>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {/* Add to Cart & Wishlist & Share */}
        <div className="flex gap-2">
          <button
            onClick={handleAdd}
            className="flex-1 h-12 sm:h-14 border-2 border-[var(--color-nt-black)] text-[var(--color-nt-black)] text-[13px] sm:text-[14px] font-semibold uppercase tracking-wider hover:bg-[var(--color-nt-black)] hover:text-[var(--color-nt-white)] transition-all duration-200 cursor-pointer"
          >
            Add to Cart
          </button>
          <button
            onClick={() =>
              toggle({
                productId: product.id,
                slug: product.slug,
                name: product.name,
                image: mainImg || '',
                price,
              })
            }
            className={cn(
              'w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center border-2 transition-all duration-200 cursor-pointer',
              wished
                ? 'border-[var(--color-nt-black)] bg-[var(--color-nt-black)] text-[var(--color-nt-white)]'
                : 'border-[var(--color-nt-light-gray)] text-[var(--color-nt-mid-gray)] hover:border-[var(--color-nt-black)] hover:text-[var(--color-nt-black)]',
            )}
            aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart size={20} strokeWidth={1.5} className={cn(wished && 'fill-current')} />
          </button>
          <button
            className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center border-2 border-[var(--color-nt-light-gray)] text-[var(--color-nt-mid-gray)] hover:border-[var(--color-nt-black)] hover:text-[var(--color-nt-black)] transition-all duration-200 cursor-pointer"
            aria-label="Share product"
          >
            <Share2 size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Terms & Conditions */}
        <label className="flex items-start gap-3 cursor-pointer">
          <div
            className={cn(
              'w-5 h-5 border flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors',
              agreedToTerms
                ? 'border-[var(--color-nt-black)] bg-[var(--color-nt-black)]'
                : 'border-[var(--color-nt-light-gray)]',
            )}
          >
            {agreedToTerms && <Check size={14} className="text-[var(--color-nt-white)]" />}
          </div>
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="sr-only"
          />
          <span className="text-[13px] text-[var(--color-nt-mid-gray)]">
            I agree with the{' '}
            <a
              href="/legal/terms"
              className="underline text-[var(--color-nt-black)] hover:text-[var(--color-nt-mid-gray)]"
            >
              Terms & Conditions
            </a>
          </span>
        </label>

        {/* Buy It Now */}
        <button
          onClick={handleBuyNow}
          className="w-full h-12 sm:h-14 border border-[var(--color-nt-black)] text-[var(--color-nt-mid-gray)] text-[13px] sm:text-[14px] font-semibold uppercase tracking-wider hover:bg-[var(--color-nt-black)] hover:text-[var(--color-nt-white)] transition-all duration-200 cursor-pointer"
        >
          Buy It Now
        </button>
      </div>

      {/* Pickup Info */}
      <div className="pt-2 space-y-1">
        <div className="flex items-center gap-2 text-[13px] text-[var(--color-nt-black)]">
          <Check size={14} className="text-green-600" />
          <span>
            Pickup available at <strong>123 Fashion Avenue, NYC</strong>
          </span>
        </div>
        <p className="text-[12px] text-[var(--color-nt-mid-gray)] pl-5">
          Usually ready in 24 hours
        </p>
        <a
          href="#"
          className="text-[12px] text-[var(--color-nt-black)] underline pl-5 hover:text-[var(--color-nt-mid-gray)]"
        >
          View store information
        </a>
      </div>

      {/* Accordion Sections */}
      <div className="border-t border-[var(--color-nt-light-gray)] pt-4 space-y-0">
        <Accordion title="Description">
          <div className="text-[13px] text-[var(--color-nt-mid-gray)] leading-relaxed pb-4">
            {product.shortDescription || 'No description available.'}
          </div>
        </Accordion>
        <Accordion title="Shipping & Return">
          <div className="text-[13px] text-[var(--color-nt-mid-gray)] leading-relaxed pb-4 space-y-2">
            <p>Free shipping on orders over $150. Standard delivery 3-5 business days.</p>
            <p>30-day return policy. Items must be unworn with original tags.</p>
          </div>
        </Accordion>
        <Accordion title="Size Guide">
          <div className="text-[13px] text-[var(--color-nt-mid-gray)] pb-4">
            <p>Please refer to our size chart for accurate measurements.</p>
          </div>
        </Accordion>
      </div>
    </motion.div>
  )
}

function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-[var(--color-nt-light-gray)]">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-4 text-left"
      >
        <span className="text-[15px] sm:text-[16px] font-semibold text-[var(--color-nt-black)]">
          {title}
        </span>
        <ChevronDown
          size={20}
          strokeWidth={1.5}
          className={cn(
            'text-[var(--color-nt-mid-gray)] transition-transform duration-200',
            open && 'rotate-180',
          )}
        />
      </button>
      <div
        className={cn(
          'grid transition-all duration-200',
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  )
}
