import { apiFetch } from './api'
import type { Reservacion } from '../types'

export const reservationService = {
  crear: (data: { id_slot: string; id_challenge: string }) =>
    apiFetch<void>('/reservation', { method: 'POST', body: JSON.stringify(data) }),

  getMios: (anho: number, mes: number) =>
    apiFetch<Reservacion[]>(`/reservation/mios?anho=${anho}&mes=${mes}`)
}