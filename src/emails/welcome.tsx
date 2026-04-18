import { Html, Head, Body, Container, Heading, Text, Link } from '@react-email/components'

export function WelcomeEmail({ firstName }: { firstName?: string }) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: 'Helvetica, Arial, sans-serif', backgroundColor: '#F5F2ED' }}>
        <Container style={{ maxWidth: 560, margin: '0 auto', padding: 32 }}>
          <Heading>Welcome{firstName ? `, ${firstName}` : ''}.</Heading>
          <Text>Here's 10% off your first order: use code <strong>WELCOME10</strong> at checkout.</Text>
          <Link href={`${process.env.NEXT_PUBLIC_SERVER_URL}/shop`}>Start shopping →</Link>
        </Container>
      </Body>
    </Html>
  )
}
