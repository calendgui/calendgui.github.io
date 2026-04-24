import { auth } from '../config/firebase'

const BASE = import.meta.env.VITE_API_URL

async function getToken(): Promise<string> {
  const user = auth.currentUser
  if (!user) throw new Error('Sin sesión')
  return user.getIdToken()
}

export async function apiFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getToken()
  const res = await fetch(BASE + url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error ?? `API error ${res.status}`)
  }
  return res.json()
}