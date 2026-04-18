import { Html, Head, Body, Container, Heading, Text, Section, Hr, Link, Row, Column } from '@react-email/components'

export function OrderConfirmationEmail({ order }: { order: any }) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: 'Helvetica, Arial, sans-serif', backgroundColor: '#F5F2ED', color: '#111110' }}>
        <Container style={{ maxWidth: 560, margin: '0 auto', padding: 32 }}>
          <Heading style={{ fontSize: 32, letterSpacing: 2 }}>NOVA THREADS</Heading>
          <Text>Thank you for your order.</Text>
          <Heading as="h2" style={{ fontSize: 20 }}>Order {order.orderNumber}</Heading>
          <Hr />
          {order.items?.map((item: any, i: number) => (
            <Row key={i}>
              <Column>{item.variantLabel} × {item.quantity}</Column>
              <Column align="right">${item.totalPrice?.toFixed(2)}</Column>
            </Row>
          ))}
          <Hr />
          <Row><Column>Total</Column><Column align="right"><strong>${order.total?.toFixed(2)}</strong></Column></Row>
          <Section style={{ marginTop: 32 }}>
            <Link href={`${process.env.NEXT_PUBLIC_SERVER_URL}/account/orders/${order.id}`}>
              Track your order →
            </Link>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
