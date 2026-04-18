// API Client for Payload CMS
const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

export async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_URL}${endpoint}`

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

// Generic fetch functions for collections
export async function fetchCollection<T>(
  collection: string,
  params?: Record<string, string>
): Promise<{ docs: T[]; totalDocs: number; page: number; totalPages: number }> {
  const searchParams = new URLSearchParams(params)
  const query = searchParams.toString() ? `?${searchParams.toString()}` : ''
  return fetchApi(`/api/${collection}${query}`)
}

export async function fetchDocument<T>(
  collection: string,
  id: string
): Promise<T> {
  return fetchApi(`/api/${collection}/${id}`)
}

export async function fetchBySlug<T>(
  collection: string,
  slug: string
): Promise<T> {
  return fetchApi(`/api/${collection}/where[slug][equals]=${slug}`)
}

export async function fetchGlobal<T>(slug: string): Promise<T> {
  return fetchApi(`/api/globals/${slug}`)
}
