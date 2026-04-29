import { Html, Head, Body, Container, Heading, Text, Row, Column, Link, Section, Hr } from '@react-email/components'

interface InvoiceItem {
  name: string
  sku?: string | null
  variantLabel?: string | null
  quantity: number
  price: number
  total: number
}

interface InvoiceEmailProps {
  invoiceNumber: string
  orderNumber: string
  date: string
  customerName: string
  customerEmail: string
  billingAddress?: string
  shippingAddress?: string
  items: InvoiceItem[]
  subtotal: number
  shippingCost: number
  tax: number
  discount: number
  total: number
  currency?: string
}

export function InvoiceEmail({
  invoiceNumber,
  orderNumber,
  date,
  customerName,
  customerEmail,
  billingAddress,
  shippingAddress,
  items,
  subtotal,
  shippingCost,
  tax,
  discount,
  total,
  currency = 'USD',
}: InvoiceEmailProps) {
  const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(n)

  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: 'Helvetica, Arial, sans-serif', backgroundColor: '#F5F2ED', color: '#111110' }}>
        <Container style={{ maxWidth: 600, margin: '0 auto', padding: 32 }}>
          <Heading style={{ fontSize: 24, marginBottom: 8 }}>NOVA THREADS</Heading>
          <Text style={{ fontSize: 14, color: '#6B6B6B', marginBottom: 24 }}>Invoice {invoiceNumber}</Text>

          <Section>
            <Row>
              <Column>
                <Text style={{ fontSize: 12, color: '#6B6B6B', marginBottom: 4 }}>Order</Text>
                <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{orderNumber}</Text>
              </Column>
              <Column>
                <Text style={{ fontSize: 12, color: '#6B6B6B', marginBottom: 4 }}>Date</Text>
                <Text style={{ fontSize: 14 }}>
                  {new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </Text>
              </Column>
            </Row>
          </Section>

          <Hr style={{ borderColor: '#E5E5E5', margin: '24px 0' }} />

          <Section>
            <Row>
              <Column style={{ width: '50%', paddingRight: 16 }}>
                <Text style={{ fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
                  Bill To
                </Text>
                <Text style={{ fontSize: 14, marginBottom: 4 }}>{customerName}</Text>
                <Text style={{ fontSize: 13, color: '#6B6B6B', whiteSpace: 'pre-line' }}>{billingAddress || 'N/A'}</Text>
                <Text style={{ fontSize: 13, color: '#6B6B6B' }}>{customerEmail}</Text>
              </Column>
              <Column style={{ width: '50%', paddingLeft: 16 }}>
                <Text style={{ fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
                  Ship To
                </Text>
                <Text style={{ fontSize: 13, color: '#6B6B6B', whiteSpace: 'pre-line' }}>{shippingAddress || 'N/A'}</Text>
              </Column>
            </Row>
          </Section>

          <Hr style={{ borderColor: '#E5E5E5', margin: '24px 0' }} />

          <Section>
            <Row style={{ borderBottom: '1px solid #E5E5E5', paddingBottom: 8, marginBottom: 8 }}>
              <Column style={{ width: '45%' }}><Text style={{ fontSize: 12, fontWeight: 'bold' }}>Item</Text></Column>
              <Column style={{ width: '20%' }}><Text style={{ fontSize: 12, fontWeight: 'bold' }}>SKU</Text></Column>
              <Column style={{ width: '10%' }}><Text style={{ fontSize: 12, fontWeight: 'bold', textAlign: 'center' }}>Qty</Text></Column>
              <Column style={{ width: '12%' }}><Text style={{ fontSize: 12, fontWeight: 'bold', textAlign: 'right' }}>Price</Text></Column>
              <Column style={{ width: '13%' }}><Text style={{ fontSize: 12, fontWeight: 'bold', textAlign: 'right' }}>Total</Text></Column>
            </Row>
            {items.map((item, i) => (
              <Row key={i} style={{ borderBottom: '1px solid #F0F0F0', padding: '8px 0' }}>
                <Column style={{ width: '45%' }}>
                  <Text style={{ fontSize: 13, margin: 0 }}>{item.name}</Text>
                  {item.variantLabel && (
                    <Text style={{ fontSize: 11, color: '#6B6B6B', margin: '2px 0 0 0' }}>{item.variantLabel}</Text>
                  )}
                </Column>
                <Column style={{ width: '20%' }}>
                  <Text style={{ fontSize: 12, color: '#6B6B6B', margin: 0 }}>{item.sku || '-'}</Text>
                </Column>
                <Column style={{ width: '10%' }}>
                  <Text style={{ fontSize: 13, textAlign: 'center', margin: 0 }}>{item.quantity}</Text>
                </Column>
                <Column style={{ width: '12%' }}>
                  <Text style={{ fontSize: 13, textAlign: 'right', margin: 0 }}>{fmt(item.price)}</Text>
                </Column>
                <Column style={{ width: '13%' }}>
                  <Text style={{ fontSize: 13, textAlign: 'right', margin: 0, fontWeight: 'bold' }}>{fmt(item.total)}</Text>
                </Column>
              </Row>
            ))}
          </Section>

          <Section style={{ marginTop: 24 }}>
            <Row>
              <Column style={{ width: '60%' }} />
              <Column style={{ width: '40%' }}>
                <Row style={{ marginBottom: 4 }}>
                  <Column><Text style={{ fontSize: 13, color: '#6B6B6B', margin: 0 }}>Subtotal</Text></Column>
                  <Column><Text style={{ fontSize: 13, textAlign: 'right', margin: 0 }}>{fmt(subtotal)}</Text></Column>
                </Row>
                {discount > 0 && (
                  <Row style={{ marginBottom: 4 }}>
                    <Column><Text style={{ fontSize: 13, color: '#6B6B6B', margin: 0 }}>Discount</Text></Column>
                    <Column><Text style={{ fontSize: 13, textAlign: 'right', margin: 0, color: '#D93025' }}>-{fmt(discount)}</Text></Column>
                  </Row>
                )}
                <Row style={{ marginBottom: 4 }}>
                  <Column><Text style={{ fontSize: 13, color: '#6B6B6B', margin: 0 }}>Shipping</Text></Column>
                  <Column>
                    <Text style={{ fontSize: 13, textAlign: 'right', margin: 0 }}>
                      {shippingCost === 0 ? 'Free' : fmt(shippingCost)}
                    </Text>
                  </Column>
                </Row>
                {tax > 0 && (
                  <Row style={{ marginBottom: 4 }}>
                    <Column><Text style={{ fontSize: 13, color: '#6B6B6B', margin: 0 }}>Tax</Text></Column>
                    <Column><Text style={{ fontSize: 13, textAlign: 'right', margin: 0 }}>{fmt(tax)}</Text></Column>
                  </Row>
                )}
                <Hr style={{ borderColor: '#111110', margin: '12px 0' }} />
                <Row>
                  <Column><Text style={{ fontSize: 14, fontWeight: 'bold', margin: 0 }}>Total</Text></Column>
                  <Column><Text style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'right', margin: 0 }}>{fmt(total)}</Text></Column>
                </Row>
              </Column>
            </Row>
          </Section>

          <Hr style={{ borderColor: '#E5E5E5', margin: '32px 0' }} />

          <Text style={{ fontSize: 13, textAlign: 'center', color: '#6B6B6B' }}>
            Thank you for shopping with NOVA THREADS.
          </Text>
          <Text style={{ fontSize: 12, textAlign: 'center', color: '#6B6B6B', marginTop: 8 }}>
            Questions? Contact us at{' '}
            <Link href="mailto:support@novathreads.com" style={{ color: '#111110' }}>
              support@novathreads.com
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
