import { Html, Head, Body, Container, Heading, Text, Link } from '@react-email/components'

export function BackInStockEmail({ productSlug, productName }: { productSlug: string; productName: string }) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: 'Helvetica, Arial, sans-serif', backgroundColor: '#F5F2ED' }}>
        <Container style={{ maxWidth: 560, margin: '0 auto', padding: 32 }}>
          <Heading>{productName} is back.</Heading>
          <Text>The piece you were watching is available again. Quantities are limited.</Text>
          <Link href={`${process.env.NEXT_PUBLIC_SERVER_URL}/products/${productSlug}`}>Shop now →</Link>
        </Container>
      </Body>
    </Html>
  )
}
