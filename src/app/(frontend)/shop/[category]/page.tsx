import { redirect } from 'next/navigation'

interface Props {
  params: Promise<{ category: string }>
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params
  // Redirect all category pages to main shop with category filter
  redirect(`/shop?category=${category}`)
}
