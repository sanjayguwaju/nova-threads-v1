'use server'

import { getPayload } from './payload/getPayload'

interface StockCheck {
  productId: string
  variantSku?: string
  quantity: number
}

export async function validateStock(items: StockCheck[]): Promise<{
  valid: boolean
  invalidItems: { item: StockCheck; available: number }[]
}> {
  const payload = await getPayload()
  const invalidItems: { item: StockCheck; available: number }[] = []

  for (const item of items) {
    const product = await payload.findByID({
      collection: 'products',
      id: item.productId,
    })

    let available = 0
    if (item.variantSku && product.variants?.length) {
      const variant = product.variants.find((v: any) => v.sku === item.variantSku)
      available = variant?.stock ?? 0
    } else {
      // If no variants, we could add a base stock field to products
      // For now, assume sufficient stock if no variants tracked
      available = Infinity
    }

    if (available < item.quantity) {
      invalidItems.push({ item, available })
    }
  }

  return { valid: invalidItems.length === 0, invalidItems }
}

export async function decrementStock(items: StockCheck[]): Promise<void> {
  const payload = await getPayload()

  for (const item of items) {
    const product = await payload.findByID({
      collection: 'products',
      id: item.productId,
    })

    if (item.variantSku && product.variants?.length) {
      const updatedVariants = product.variants.map((v: any) => {
        if (v.sku === item.variantSku) {
          return { ...v, stock: Math.max(0, (v.stock ?? 0) - item.quantity) }
        }
        return v
      })

      await payload.update({
        collection: 'products',
        id: item.productId,
        data: { variants: updatedVariants },
      })
    }
  }
}

export async function restoreStock(items: StockCheck[]): Promise<void> {
  const payload = await getPayload()

  for (const item of items) {
    const product = await payload.findByID({
      collection: 'products',
      id: item.productId,
    })

    if (item.variantSku && product.variants?.length) {
      const updatedVariants = product.variants.map((v: any) => {
        if (v.sku === item.variantSku) {
          return { ...v, stock: (v.stock ?? 0) + item.quantity }
        }
        return v
      })

      await payload.update({
        collection: 'products',
        id: item.productId,
        data: { variants: updatedVariants },
      })
    }
  }
}
