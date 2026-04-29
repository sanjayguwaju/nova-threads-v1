import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from '@/lib/payload/getPayload'
import { getCurrentUser } from '@/lib/payload/actions/auth'
import { generateInvoicePDF, formatAddress, type InvoiceData } from '@/lib/invoice'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // Auth check
  let user: any = null
  try { user = await getCurrentUser() } catch {}
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const payload = await getPayload()
    const order = await payload.findByID({ collection: 'orders', id, depth: 2 })
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Authorization
    const ownerId = typeof order.customer === 'object' ? order.customer?.id : order.customer
    if (ownerId !== user.id && user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Build invoice data
    const customerName =
      typeof order.customer === 'object'
        ? [order.customer?.firstName, order.customer?.lastName].filter(Boolean).join(' ')
        : 'Guest'
    const customerEmail =
      typeof order.customer === 'object' ? order.customer?.email : order.guestEmail || ''

    const invoiceData: InvoiceData = {
      invoiceNumber: order.invoiceNumber || order.orderNumber || `INV-${order.id}`,
      orderNumber: order.orderNumber || `ORD-${order.id}`,
      date: order.invoiceDate || order.createdAt,
      customer: { name: customerName, email: customerEmail },
      billingAddress: order.billingAddress,
      shippingAddress: order.shippingAddress,
      items:
        order.items?.map((item: any) => ({
          name: typeof item.product === 'object' ? item.product?.name || 'Product' : 'Product',
          sku: item.variantSku,
          variantLabel: item.variantLabel,
          quantity: item.quantity || 1,
          price: item.price || 0,
          total: item.total || (item.price || 0) * (item.quantity || 1),
        })) || [],
      subtotal: order.subtotal || 0,
      shippingCost: order.shippingCost || 0,
      tax: order.tax || 0,
      discount: order.discount || 0,
      total: order.total || 0,
      currency: order.currency || 'USD',
      paymentMethod: order.stripePaymentIntentId ? 'Card (Stripe)' : undefined,
    }

    const pdf = await generateInvoicePDF(invoiceData)

    // Update invoice sent flag
    if (!order.invoiceSent) {
      await payload.update({
        collection: 'orders',
        id: order.id,
        data: { invoiceSent: true, invoiceDate: new Date().toISOString() } as any,
      })
    }

    return new NextResponse(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${invoiceData.invoiceNumber}.pdf"`,
      },
    })
  } catch (err) {
    console.error('Invoice generation error:', err)
    return NextResponse.json({ error: 'Failed to generate invoice' }, { status: 500 })
  }
}
