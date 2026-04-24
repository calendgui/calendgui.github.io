import { apiFetch } from './api'
import type { SlotType } from '../types'

export const slotsTypeService = {
  getAll: () => apiFetch<SlotType[]>('/slots-type'),
}