'use server'

import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from '../getPayload'

export async function login(email: string, password: string) {
  const payload = await getPayload()
  const result = await payload.login({ collection: 'users', data: { email, password } })
  if (result.token) {
    const cookieStore = await cookies()
    cookieStore.set('payload-token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    })
  }
  return { user: result.user }
}

export async function register(data: {
  email: string
  password: string
  firstName: string
  lastName: string
}) {
  const payload = await getPayload()
  await payload.create({ collection: 'users', data: { ...data, role: 'customer' } })
  return login(data.email, data.password)
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('payload-token')
  redirect('/')
}

export async function getCurrentUser() {
  const payload = await getPayload()
  const headersList = await headers()
  const { user } = await payload.auth({ headers: headersList })
  return user
}

export async function forgotPassword(email: string) {
  const payload = await getPayload()
  await payload.forgotPassword({ collection: 'users', data: { email } })
  return { ok: true }
}

export async function resetPassword(token: string, password: string) {
  const payload = await getPayload()
  await payload.resetPassword({ collection: 'users', data: { token, password }, overrideAccess: true })
  return { ok: true }
}
