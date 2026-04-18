import { Html, Head, Body, Container, Heading, Text, Link } from '@react-email/components'

export function PasswordResetEmail({ resetUrl }: { resetUrl: string }) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: 'Helvetica, Arial, sans-serif', backgroundColor: '#F5F2ED' }}>
        <Container style={{ maxWidth: 560, margin: '0 auto', padding: 32 }}>
          <Heading>Reset your password</Heading>
          <Text>Click the link below to reset your password. This link expires in 1 hour.</Text>
          <Link href={resetUrl}>Reset password →</Link>
          <Text style={{ color: '#8C8880', fontSize: 12, marginTop: 24 }}>
            If you did not request this, ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
