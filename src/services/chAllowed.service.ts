import { apiFetch } from './api'
import type { Challenge } from '../types'


export const chAllowedService = {
  getByUid: (uid: string) => apiFetch<Challenge[]>(`/ch-allowed/${uid}`),
}