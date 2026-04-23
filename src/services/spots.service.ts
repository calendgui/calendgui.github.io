import { apiFetch } from './api'
import type { Spot } from '../types'

export const spotsService = {
  getAll: () => apiFetch<Spot[]>('/spots'),
}