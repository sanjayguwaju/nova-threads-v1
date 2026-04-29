import { Html, Head, Body, Container, Heading, Text, Link, Button } from '@react-email/components'

interface AbandonedCartEmailProps {
  firstName?: string
  items: Array<{
    name: string
    image?: string
    price: number
    quantity: number
  }>
  cartUrl: string
}

export function AbandonedCartEmail({ firstName, items, cartUrl }: AbandonedCartEmailProps) {
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)

  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: 'Helvetica, Arial, sans-serif', backgroundColor: '#F5F2ED', color: '#111110' }}>
        <Container style={{ maxWidth: 560, margin: '0 auto', padding: 32 }}>
          <Heading style={{ fontSize: 24 }}>Your bag is waiting{firstName ? `, ${firstName}` : ''}.</Heading>
          <Text style={{ fontSize: 15, lineHeight: '24px' }}>
            You left some great items behind. Complete your order while they're still available.
          </Text>

          <div style={{ marginTop: 24, marginBottom: 24 }}>
            {items.map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: '16px 0',
                  borderBottom: '1px solid #E5E5E5',
                }}
              >
                <div style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: 'bold', margin: 0 }}>{item.name}</Text>
                  <Text style={{ fontSize: 13, color: '#6B6B6B', margin: '4px 0 0 0' }}>
                    Qty: {item.quantity} · {fmt(item.price)} each
                  </Text>
                </div>
                <Text style={{ fontSize: 14, fontWeight: 'bold', margin: 0 }}>{fmt(item.price * item.quantity)}</Text>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'right', marginBottom: 24 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', margin: 0 }}>Total: {fmt(total)}</Text>
          </div>

          <Button
            href={cartUrl}
            style={{
              backgroundColor: '#111110',
              color: '#F5F2ED',
              padding: '14px 28px',
              fontSize: 13,
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: 1,
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            Complete Your Order
          </Button>

          <Text style={{ fontSize: 12, color: '#6B6B6B', marginTop: 24 }}>
            Need help? Contact us at{' '}
            <Link href="mailto:support@novathreads.com" style={{ color: '#111110' }}>
              support@novathreads.com
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
