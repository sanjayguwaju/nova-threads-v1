import { Html, Head, Body, Container, Heading, Text, Link } from '@react-email/components'

export function ReviewRequestEmail({ productSlug, productName }: { productSlug: string; productName: string }) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: 'Helvetica, Arial, sans-serif', backgroundColor: '#F5F2ED' }}>
        <Container style={{ maxWidth: 560, margin: '0 auto', padding: 32 }}>
          <Heading>How is your {productName}?</Heading>
          <Text>Share your thoughts with a quick review.</Text>
          <Link href={`${process.env.NEXT_PUBLIC_SERVER_URL}/products/${productSlug}#reviews`}>
            Leave a review →
          </Link>
        </Container>
      </Body>
    </Html>
  )
}
