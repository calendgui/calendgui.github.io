

export interface Slot {
  id: string
  id_supervisor: string
  nombre_supervisor?: string
  fecha: string
  hora: string
  id_spot: string
  type: string
  duracion: number
  challenge: string | null
  estado: boolean
  id_evaluado: string | null
  evaluado_nombre: string | null
  batch: number | null
  evento_id: string | null
}

export interface CrearSlotDTO {
  
}

export interface CrearRangoDTO {
  
}

export interface SlotType {
  id: string
  nombre: string
  duracion: number
}


export interface Spot {
  id: string
  nombre: string
  color: string
}

export interface UserConfig {
  user_id: string
  dias_bloqueados: number[]
  horas_bloqueadas: string[]
  fechas_bloqueadas: string[]
}

export interface CrearReservation {

}

export interface Challenge {
  id: string
  etapa: string
  nombre: string
}

export interface Challenge {
  id: string
  etapa: string
  nombre: string
}