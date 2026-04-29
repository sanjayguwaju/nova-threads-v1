import { Resend } from 'resend'
import { OrderConfirmationEmail } from '@/emails/order-confirmation'
import { WelcomeEmail } from '@/emails/welcome'
import { ShippingNotificationEmail } from '@/emails/shipping-notification'
import { InvoiceEmail } from '@/emails/invoice'
import { AbandonedCartEmail } from '@/emails/abandoned-cart'
import { PasswordResetEmail } from '@/emails/password-reset'
import { formatAddress } from './invoice'

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder')

const FROM = 'NOVA THREADS <orders@novathreads.com>'

export async function sendEmail(opts: { to: string; subject: string; react: any }) {
  try {
    await resend.emails.send({ from: FROM, ...opts })
  } catch (err) {
    console.error('email send failed', err)
  }
}

export async function sendOrderConfirmationEmail(order: any) {
  const email = order.customer?.email || order.guestEmail
  if (!email) {
    console.warn('No email address for order confirmation', order.id)
    return
  }

  await sendEmail({
    to: email,
    subject: `Order confirmed: ${order.orderNumber}`,
    react: OrderConfirmationEmail({ order }),
  })
}

export async function sendWelcomeEmail(user: { email: string; firstName?: string | null }) {
  await sendEmail({
    to: user.email,
    subject: 'Welcome to NOVA THREADS',
    react: WelcomeEmail({ firstName: user.firstName || undefined }),
  })
}

export async function sendShippingNotificationEmail(order: any) {
  const email = order.customer?.email || order.guestEmail
  if (!email) {
    console.warn('No email address for shipping notification', order.id)
    return
  }

  await sendEmail({
    to: email,
    subject: `Your order is on its way: ${order.orderNumber}`,
    react: ShippingNotificationEmail({ order }),
  })
}

export async function sendInvoiceEmail(order: any) {
  const email = order.customer?.email || order.guestEmail
  if (!email) {
    console.warn('No email address for invoice', order.id)
    return
  }

  const customerName =
    typeof order.customer === 'object'
      ? [order.customer?.firstName, order.customer?.lastName].filter(Boolean).join(' ')
      : 'Guest'

  const items =
    order.items?.map((item: any) => ({
      name: typeof item.product === 'object' ? item.product?.name || 'Product' : 'Product',
      sku: item.variantSku,
      variantLabel: item.variantLabel,
      quantity: item.quantity || 1,
      price: item.price || 0,
      total: item.total || (item.price || 0) * (item.quantity || 1),
    })) || []

  await sendEmail({
    to: email,
    subject: `Invoice for ${order.invoiceNumber || order.orderNumber}`,
    react: InvoiceEmail({
      invoiceNumber: order.invoiceNumber || order.orderNumber,
      orderNumber: order.orderNumber,
      date: order.invoiceDate || order.createdAt,
      customerName,
      customerEmail: email,
      billingAddress: formatAddress(order.billingAddress),
      shippingAddress: formatAddress(order.shippingAddress),
      items,
      subtotal: order.subtotal || 0,
      shippingCost: order.shippingCost || 0,
      tax: order.tax || 0,
      discount: order.discount || 0,
      total: order.total || 0,
      currency: order.currency || 'USD',
    }),
  })
}

export async function sendAbandonedCartEmail(opts: {
  email: string
  firstName?: string | null
  items: Array<{ name: string; image?: string; price: number; quantity: number }>
  cartUrl: string
}) {
  await sendEmail({
    to: opts.email,
    subject: 'You left something behind...',
    react: AbandonedCartEmail({
      firstName: opts.firstName || undefined,
      items: opts.items,
      cartUrl: opts.cartUrl,
    }),
  })
}

export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  await sendEmail({
    to: email,
    subject: 'Reset your NOVA THREADS password',
    react: PasswordResetEmail({ resetUrl }),
  })
}
