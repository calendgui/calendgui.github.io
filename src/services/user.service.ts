import { apiFetch } from './api'

export interface AppUser {
  uid: string
  email: string
  nombre: string
  foto: string
  rol: number
  ci?: string
  batch?: number
}

export const usersService = {
  getMe: () => apiFetch<AppUser>('/users/me'),
  actualizarPerfil: (data: { ci: string; batch: number }) =>
    apiFetch<AppUser>('/users/me/perfil', { method: 'PATCH', body: JSON.stringify(data) }),
}