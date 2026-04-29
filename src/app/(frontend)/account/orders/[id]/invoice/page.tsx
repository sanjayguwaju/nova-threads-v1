'use client'

import { notFound, useParams } from 'next/navigation'
import { formatCurrency } from '@/lib/utils/formatCurrency'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Order {
  id: string
  orderNumber: string
  invoiceNumber?: string
  invoiceDate?: string
  createdAt: string
  customer?: { id: string; firstName?: string; lastName?: string; email?: string } | string
  guestEmail?: string
  billingAddress?: any
  shippingAddress?: any
  items?: any[]
  subtotal?: number
  discount?: number
  shippingCost?: number
  tax?: number
  total?: number
}

export default function InvoicePage() {
  const params = useParams()
  const id = params.id as string
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/orders/${id}`)
        if (!res.ok) throw new Error('Order not found')
        const data = await res.json()
        setOrder(data)
      } catch {
        setOrder(null)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  if (loading) {
    return (
      <div className="max-w-[800px] mx-auto p-8 md:p-12">
        <div className="animate-pulse">
          <div className="h-8 bg-stone/20 rounded w-48 mb-4"></div>
          <div className="h-4 bg-stone/20 rounded w-32"></div>
        </div>
      </div>
    )
  }

  if (!order) notFound()

  const invoiceNumber = order.invoiceNumber || order.orderNumber
  const date = order.invoiceDate || order.createdAt

  const formatAddr = (addr: any) => {
    if (!addr) return 'N/A'
    const parts = [
      [addr.firstName, addr.lastName].filter(Boolean).join(' '),
      addr.line1,
      addr.line2,
      [addr.city, addr.state, addr.zip].filter(Boolean).join(', '),
      addr.country,
    ].filter(Boolean)
    return parts.join(', ')
  }

  const customerName =
    typeof order.customer === 'object'
      ? [order.customer?.firstName, order.customer?.lastName].filter(Boolean).join(' ')
      : 'Guest'
  const customerEmail =
    typeof order.customer === 'object' ? order.customer?.email : order.guestEmail || 'N/A'

  return (
    <div className="max-w-[800px] mx-auto p-8 md:p-12 bg-white">
      <style jsx global>{`
        @media print {
          body {
            background: white;
          }
          .no-print {
            display: none !important;
          }
          .print-break-inside {
            break-inside: avoid;
          }
        }
      `}</style>

      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">NOVA THREADS</h1>
          <p className="text-sm text-stone">Premium Fashion for Everyone</p>
        </div>
        <div className="text-right">
          <h2 className="text-3xl font-bold">INVOICE</h2>
          <p className="text-sm text-stone mt-1">{invoiceNumber}</p>
          <p className="text-sm text-stone">
            {new Date(date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>

      {/* Order Ref */}
      <div className="mb-6 text-sm text-stone">
        Order: <span className="font-medium text-ink">{order.orderNumber}</span>
      </div>

      <hr className="border-ink mb-8" />

      {/* Addresses */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div className="print-break-inside">
          <h3 className="text-xs font-mono uppercase tracking-widest mb-3">Bill To</h3>
          <p className="font-medium">{customerName}</p>
          <p className="text-sm text-stone">{formatAddr(order.billingAddress)}</p>
          <p className="text-sm text-stone">{customerEmail}</p>
        </div>
        <div className="print-break-inside">
          <h3 className="text-xs font-mono uppercase tracking-widest mb-3">Ship To</h3>
          <p className="text-sm text-stone">{formatAddr(order.shippingAddress)}</p>
        </div>
      </div>

      {/* Items */}
      <table className="w-full mb-8 text-sm">
        <thead>
          <tr className="border-b border-ink">
            <th className="text-left py-2 font-medium">Item</th>
            <th className="text-left py-2 font-medium">Variant</th>
            <th className="text-center py-2 font-medium">Qty</th>
            <th className="text-right py-2 font-medium">Price</th>
            <th className="text-right py-2 font-medium">Total</th>
          </tr>
        </thead>
        <tbody>
          {order.items?.map((item: any, i: number) => (
            <tr key={i} className="border-b border-stone/20">
              <td className="py-3">
                {typeof item.product === 'object' ? item.product?.name : 'Product'}
              </td>
              <td className="py-3 text-stone">{item.variantSku || '-'}</td>
              <td className="py-3 text-center">{item.quantity}</td>
              <td className="py-3 text-right font-mono">{formatCurrency(item.price || 0)}</td>
              <td className="py-3 text-right font-mono">
                {formatCurrency(item.total || item.price * item.quantity)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-full max-w-[320px]">
          <div className="flex justify-between py-1 text-sm">
            <span className="text-stone">Subtotal</span>
            <span className="font-mono">{formatCurrency(order.subtotal || 0)}</span>
          </div>
          {(order.discount ?? 0) > 0 && (
            <div className="flex justify-between py-1 text-sm">
              <span className="text-stone">Discount</span>
              <span className="font-mono text-red-600">-{formatCurrency(order.discount ?? 0)}</span>
            </div>
          )}
          <div className="flex justify-between py-1 text-sm">
            <span className="text-stone">Shipping</span>
            <span className="font-mono">
              {(order.shippingCost ?? 0) === 0 ? 'Free' : formatCurrency(order.shippingCost ?? 0)}
            </span>
          </div>
          {(order.tax ?? 0) > 0 && (
            <div className="flex justify-between py-1 text-sm">
              <span className="text-stone">Tax</span>
              <span className="font-mono">{formatCurrency(order.tax ?? 0)}</span>
            </div>
          )}
          <div className="flex justify-between py-2 border-t border-ink mt-2">
            <span className="font-mono text-xs uppercase tracking-widest">Total</span>
            <span className="font-mono font-bold">{formatCurrency(order.total || 0)}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <hr className="border-stone/30 mb-6" />
      <div className="text-center text-sm text-stone">
        <p>Thank you for shopping with NOVA THREADS.</p>
        <p className="mt-1">Questions? Contact support@novathreads.com</p>
      </div>

      {/* Print Button */}
      <div className="no-print mt-12 flex gap-4 justify-center">
        <Link
          href={`/account/orders/${id}`}
          className="px-6 py-3 border border-ink text-ink text-xs font-mono uppercase tracking-widest hover:bg-ink hover:text-paper transition-colors"
        >
          Back to Order
        </Link>
        <button
          onClick={() => window.print()}
          className="px-6 py-3 bg-ink text-paper text-xs font-mono uppercase tracking-widest hover:bg-noir transition-colors"
        >
          Print / Save PDF
        </button>
      </div>
    </div>
  )
}
