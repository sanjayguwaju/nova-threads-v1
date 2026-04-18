import { Html, Head, Body, Container, Heading, Text, Link } from '@react-email/components'

export function ShippingNotificationEmail({ order }: { order: any }) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: 'Helvetica, Arial, sans-serif', backgroundColor: '#F5F2ED', color: '#111110' }}>
        <Container style={{ maxWidth: 560, margin: '0 auto', padding: 32 }}>
          <Heading>Your order is on its way</Heading>
          <Text>Order {order.orderNumber} has shipped.</Text>
          {order.trackingNumber && (
            <Text>Tracking: <strong>{order.trackingNumber}</strong></Text>
          )}
          <Link href={`${process.env.NEXT_PUBLIC_SERVER_URL}/account/orders/${order.id}`}>
            View order details →
          </Link>
        </Container>
      </Body>
    </Html>
  )
}
