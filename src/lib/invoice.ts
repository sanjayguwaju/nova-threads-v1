import PDFDocument from 'pdfkit'

export interface InvoiceData {
  invoiceNumber: string
  orderNumber: string
  date: string
  customer: {
    name: string
    email: string
  }
  billingAddress?: {
    firstName?: string | null
    lastName?: string | null
    line1?: string | null
    line2?: string | null
    city?: string | null
    state?: string | null
    zip?: string | null
    country?: string | null
  }
  shippingAddress?: {
    firstName?: string | null
    lastName?: string | null
    line1?: string | null
    line2?: string | null
    city?: string | null
    state?: string | null
    zip?: string | null
    country?: string | null
  }
  items: Array<{
    name: string
    sku?: string | null
    variantLabel?: string | null
    quantity: number
    price: number
    total: number
  }>
  subtotal: number
  shippingCost: number
  tax: number
  discount: number
  total: number
  currency: string
  paymentMethod?: string
  notes?: string
}

export function formatAddress(addr?: InvoiceData['billingAddress']): string {
  if (!addr) return ''
  const parts = [
    [addr.firstName, addr.lastName].filter(Boolean).join(' '),
    addr.line1,
    addr.line2,
    [addr.city, addr.state, addr.zip].filter(Boolean).join(', '),
    addr.country,
  ].filter(Boolean)
  return parts.join('\n')
}

export async function generateInvoicePDF(data: InvoiceData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const chunks: Buffer[] = []
      const doc = new PDFDocument({ margin: 50 })

      doc.on('data', (chunk) => chunks.push(chunk))
      doc.on('end', () => resolve(Buffer.concat(chunks)))
      doc.on('error', reject)

      // Header
      doc.fontSize(24).font('Helvetica-Bold').text('NOVA THREADS', 50, 50)
      doc.fontSize(10).font('Helvetica').text('Premium Fashion for Everyone', 50, 78)

      // Invoice Title
      doc.fontSize(28).font('Helvetica-Bold').text('INVOICE', 400, 50, { align: 'right' })
      doc.fontSize(10).font('Helvetica')
      doc.text(`Invoice #: ${data.invoiceNumber}`, 400, 85, { align: 'right' })
      doc.text(`Order #: ${data.orderNumber}`, 400, 100, { align: 'right' })
      doc.text(`Date: ${new Date(data.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 400, 115, { align: 'right' })

      // Divider
      doc.moveTo(50, 140).lineTo(550, 140).stroke('#111110')

      // Bill To / Ship To
      let y = 160
      doc.fontSize(12).font('Helvetica-Bold').text('BILL TO', 50, y)
      doc.fontSize(10).font('Helvetica')
      const billing = formatAddress(data.billingAddress)
      if (billing) {
        billing.split('\n').forEach((line, i) => {
          doc.text(line, 50, y + 18 + i * 14)
        })
      }
      doc.text(data.customer.email, 50, y + 18 + (billing ? billing.split('\n').length : 0) * 14)

      doc.fontSize(12).font('Helvetica-Bold').text('SHIP TO', 300, y)
      doc.fontSize(10).font('Helvetica')
      const shipping = formatAddress(data.shippingAddress)
      if (shipping) {
        shipping.split('\n').forEach((line, i) => {
          doc.text(line, 300, y + 18 + i * 14)
        })
      }

      // Items table
      y = 260
      doc.fontSize(10).font('Helvetica-Bold')
      doc.text('Item', 50, y)
      doc.text('SKU', 280, y)
      doc.text('Qty', 380, y)
      doc.text('Price', 430, y, { width: 60, align: 'right' })
      doc.text('Total', 500, y, { width: 50, align: 'right' })

      doc.moveTo(50, y + 18).lineTo(550, y + 18).stroke('#cccccc')
      y += 28

      doc.font('Helvetica')
      data.items.forEach((item) => {
        const nameLines = doc.heightOfString(item.name, { width: 220 })
        const rowHeight = Math.max(nameLines, 16)

        doc.text(item.name, 50, y, { width: 220 })
        doc.text(item.sku || '-', 280, y, { width: 90 })
        doc.text(String(item.quantity), 380, y, { width: 40, align: 'center' })
        doc.text(formatCurrency(item.price, data.currency), 430, y, { width: 60, align: 'right' })
        doc.text(formatCurrency(item.total, data.currency), 500, y, { width: 50, align: 'right' })
        y += rowHeight + 8
      })

      doc.moveTo(50, y).lineTo(550, y).stroke('#111110')
      y += 12

      // Totals
      const totalX = 380
      const valueX = 500
      const lineHeight = 18

      doc.font('Helvetica').text('Subtotal', totalX, y)
      doc.text(formatCurrency(data.subtotal, data.currency), valueX, y, { width: 50, align: 'right' })
      y += lineHeight

      if (data.discount > 0) {
        doc.text('Discount', totalX, y)
        doc.text(`-${formatCurrency(data.discount, data.currency)}`, valueX, y, { width: 50, align: 'right' })
        y += lineHeight
      }

      doc.text('Shipping', totalX, y)
      doc.text(
        data.shippingCost === 0 ? 'Free' : formatCurrency(data.shippingCost, data.currency),
        valueX,
        y,
        { width: 50, align: 'right' }
      )
      y += lineHeight

      if (data.tax > 0) {
        doc.text('Tax', totalX, y)
        doc.text(formatCurrency(data.tax, data.currency), valueX, y, { width: 50, align: 'right' })
        y += lineHeight
      }

      y += 4
      doc.moveTo(totalX - 10, y).lineTo(550, y).stroke('#111110')
      y += 10

      doc.font('Helvetica-Bold').fontSize(11).text('TOTAL', totalX, y)
      doc.text(formatCurrency(data.total, data.currency), valueX, y, { width: 50, align: 'right' })

      // Footer
      y += 40
      doc.fontSize(9).font('Helvetica')
      doc.moveTo(50, y).lineTo(550, y).stroke('#cccccc')
      y += 12
      doc.text('Thank you for shopping with NOVA THREADS.', 50, y, { align: 'center', width: 500 })
      y += 14
      doc.text(
        'If you have any questions about this invoice, please contact us at support@novathreads.com',
        50,
        y,
        { align: 'center', width: 500 }
      )

      if (data.paymentMethod) {
        y += 14
        doc.text(`Payment Method: ${data.paymentMethod}`, 50, y, { align: 'center', width: 500 })
      }

      if (data.notes) {
        y += 20
        doc.font('Helvetica-Bold').text('Notes:', 50, y)
        doc.font('Helvetica').text(data.notes, 50, y + 14, { width: 500 })
      }

      doc.end()
    } catch (err) {
      reject(err)
    }
  })
}

function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)
}
