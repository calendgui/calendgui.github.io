import { apiFetch } from './api'
import type { Slot, CrearSlotDTO } from '../types'

export const slotsService = {
  getPorMes: (anho: number, mes: number) =>
    apiFetch<Slot[]>(`/slots?anho=${anho}&mes=${mes}`),

  getMios: (anho: number, mes: number) =>
    apiFetch<Slot[]>(`/slots/mios?anho=${anho}&mes=${mes}`),

  crear: (data: CrearSlotDTO) =>
    apiFetch<Slot>('/slots', { method: 'POST', body: JSON.stringify(data) }),

  // crearRango: (data: CrearRangoDTO) =>
  //   apiFetch<Slot[]>('/slots/rango', { method: 'POST', body: JSON.stringify(data) }),

  eliminar: (id: string) =>
    apiFetch<void>(`/slots/${id}`, { method: 'DELETE' }),

  eliminarBulk: (ids: string[]) =>
    apiFetch<void>('/slots/bulk', { method: 'DELETE', body: JSON.stringify({ ids }) }),

  liberar: (id: string) =>
    apiFetch<void>(`/slots/${id}/liberar`, { method: 'PATCH' }),
}