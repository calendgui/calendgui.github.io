import { apiFetch } from './api'

export const reservationService = {
  crear: (data: { id_slot: string; id_challenge: string }) =>
    apiFetch<void>('/reservation', { method: 'POST', body: JSON.stringify(data) })
}