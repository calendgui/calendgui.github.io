import { apiFetch } from './api'

export const reservationService = {
  crear: (data: { id_slot: string; numero_ci: string; batch: number; id_challenge: string }) =>
    apiFetch<void>('/reservation', { method: 'POST', body: JSON.stringify(data) })
}