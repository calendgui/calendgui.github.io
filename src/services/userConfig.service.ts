import { apiFetch } from './api'
import type { UserConfig } from '../types'

export const userConfigService = {
  getMe: () => apiFetch<UserConfig>('/user-config/me'),
  crear: (data: UserConfig) =>
    apiFetch<UserConfig>('/user-config/me', { method: 'POST', body: JSON.stringify(data) }),
  actualizar: (data: Partial<UserConfig>) =>
    apiFetch<UserConfig>('/user-config/me', { method: 'PATCH', body: JSON.stringify(data) }),
}