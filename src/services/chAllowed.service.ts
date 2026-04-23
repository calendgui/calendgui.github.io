import { apiFetch } from './api'

export const chAllowedService = {
  getMe: ()          => apiFetch<ChAllowed>('/ch-allowed/me'),
  getByUid: (uid: string) => apiFetch<ChAllowed>(`/ch-allowed/${uid}`),
  crear: ()          => apiFetch<void>('/ch-allowed/me', { method: 'POST' }),
  reemplazar: (ids: string[]) =>
    apiFetch<void>('/ch-allowed/me', { method: 'PUT', body: JSON.stringify({ id_challenges: ids }) }),
  agregar: (id: string) =>
    apiFetch<void>('/ch-allowed/me/agregar', { method: 'PATCH', body: JSON.stringify({ id_challenge: id }) }),
  quitar: (id: string) =>
    apiFetch<void>('/ch-allowed/me/quitar', { method: 'PATCH', body: JSON.stringify({ id_challenge: id }) }),
}