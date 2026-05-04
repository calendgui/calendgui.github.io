// services/announcements.service.ts
import { apiFetch } from './api'
import type { Anuncio } from '../types'

export const announcementsService = {
  getAll: () =>
    apiFetch<Anuncio[]>('/announcements'),

  crear: (data: { titulo: string; img_url: string }) =>
    apiFetch<{ ok: boolean; id: string }>('/announcements', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  eliminar: (id: string) =>
    apiFetch<{ ok: true }>(`/announcements/${id}`, { method: 'DELETE' })
}