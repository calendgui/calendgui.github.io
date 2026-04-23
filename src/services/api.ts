import { auth } from '../config/firebase'

const BASE = import.meta.env.VITE_API_URL // ej: http://localhost:3000

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
  if (!res.ok) throw new Error(`API error ${res.status}`)
  return res.json()
}