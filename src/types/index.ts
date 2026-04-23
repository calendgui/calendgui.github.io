

export interface Slot {
  id: string
  id_supervisor: string
  fecha: string
  hora: string
  id_spot: string
  type: string
  duracion: number
  challenge: string | null
  estado: boolean
  evaluado_id: string | null
  evaluado_mail: string | null
  evaluado_nombre: string | null
  batch: number | null
  evento_id: string | null
}

export interface Spot {
  id: string
  nombre: string
  color: string
}