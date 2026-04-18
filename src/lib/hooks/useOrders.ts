import { useQuery } from '@tanstack/react-query'
import { fetchCollection, fetchDocument } from '../api/client'

export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (filters?: Record<string, string>) => [...orderKeys.lists(), filters] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
}

export interface Order {
  id: string
  orderNumber: string
  customer?: string | { id: string; email: string; firstName: string; lastName: string }
  guestEmail?: string
  items: Array<{
    product?: string | { id: string; name: string; slug: string; mainImage?: { url: string } }
    variantSku: string
    variantLabel?: string
    quantity: number
    unitPrice: number
    totalPrice: number
  }>
  subtotal: number
  discount: number
  shipping: number
  tax: number
  total: number
  coupon?: string | { code: string; type: string; value: number }
  status: 'pending' | 'payment_failed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  shippingAddress?: {
    firstName: string
    lastName: string
    line1: string
    line2?: string
    city: string
    state: string
    zip: string
    country: string
    phone?: string
  }
  billingAddress?: {
    firstName: string
    lastName: string
    line1: string
    line2?: string
    city: string
    state: string
    zip: string
    country: string
    phone?: string
  }
  trackingNumber?: string
  notes?: string
  timeline?: Array<{
    status: string
    timestamp: string
    note?: string
  }>
  createdAt: string
  updatedAt: string
}

// Get user's orders
export function useOrders(options?: { customerId?: string; status?: string }) {
  const params: Record<string, string> = { depth: '2', sort: '-createdAt' }

  if (options?.customerId) {
    params['where[customer][equals]'] = options.customerId
  }
  if (options?.status) {
    params['where[status][equals]'] = options.status
  }

  return useQuery({
    queryKey: orderKeys.list(params),
    queryFn: () => fetchCollection<Order>('orders', params),
  })
}

// Get single order by ID
export function useOrder(id: string) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => fetchDocument<Order>('orders', id),
    enabled: !!id,
  })
}

// Get order by order number
export function useOrderByNumber(orderNumber: string) {
  return useQuery({
    queryKey: orderKeys.list({ orderNumber }),
    queryFn: async () => {
      const result = await fetchCollection<Order>('orders', {
        'where[orderNumber][equals]': orderNumber,
        depth: '2',
      })
      return result.docs[0] || null
    },
    enabled: !!orderNumber,
  })
}
