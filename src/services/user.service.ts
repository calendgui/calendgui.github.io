import { apiFetch } from './api'

export interface AppUser {
  uid: string
  email: string
  nombre: string
  foto: string
  rol: number
}

export const usersService = {
  getMe: () => apiFetch<AppUser>('/users/me'),
}