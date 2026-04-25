import { useState, useEffect } from 'react'
import { CalendarioMes } from '../../components/calendarioMes'
import { PanelDia } from '../../components/panelDia'
import { slotsService } from '../../services/slots.service'
import { spotsService } from '../../services/spots.service'
import type { Slot, Spot } from '../../types'
import './styles.css'

export function ParticipantePage({ auth, mostrarToast }: any) {
  console.log(auth, mostrarToast)
  const [slots, setSlots]   = useState<Slot[]>([])
  const [spots, setSpots]   = useState<Spot[]>([])
  const [fechaSel, setFechaSel] = useState<string | null>(null)
  const [slotsDia, setSlotsDia] = useState<Slot[]>([])

  useEffect(() => {
    spotsService.getAll().then(setSpots)
    const hoy = new Date()
    cargarSlots(hoy.getFullYear(), hoy.getMonth() + 1)
  }, [])

  async function cargarSlots(anho: number, mes: number) {
    const data = await slotsService.getPorMes(anho, mes)
    setSlots(data.filter(s => !s.estado))
  }

  return (
    <div className="participante-page">
      <CalendarioMes
        slots={slots}
        onDiaClick={(fecha, slotsDia) => {
          setFechaSel(fecha)
          setSlotsDia(slotsDia)
        }}
        onMesCambia={(anho, mes) => {
          setFechaSel(null)
          cargarSlots(anho, mes)
        }}
      />

      <PanelDia
        fecha={fechaSel}
        slots={slotsDia}
        spots={spots}
        onCerrar={() => setFechaSel(null)}
        onReservar={(slot) => console.log('reservar:', slot)}
      />
    </div>
  )
}