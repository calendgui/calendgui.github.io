import { apiFetch } from './api'

export const userConfigService = {
  getMe: () => apiFetch<UserConfig>('/user-config/me'),
  crear: (data: UserConfigDTO) =>
    apiFetch<UserConfig>('/user-config/me', { method: 'POST', body: JSON.stringify(data) }),
  actualizar: (data: Partial<UserConfigDTO>) =>
    apiFetch<UserConfig>('/user-config/me', { method: 'PATCH', body: JSON.stringify(data) }),
}