// services/announcements.service.ts
import { apiFetch } from './api'
import type { Anuncio } from '../types'

const BASE = import.meta.env.VITE_API_URL

export const announcementsService = {
  getAll: async (): Promise<Anuncio[]> => {
    const res = await fetch(`${BASE}/announcements`, {
      headers: { 'Content-Type': 'application/json' }
    })
    if (!res.ok) throw new Error(`API error ${res.status}`)
    return res.json()
  },

  crear: (data: { titulo: string; img_url: string }) =>
    apiFetch<{ ok: boolean; id: string }>('/announcements', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  eliminar: (id: string) =>
    apiFetch<{ ok: true }>(`/announcements/${id}`, { method: 'DELETE' })
}