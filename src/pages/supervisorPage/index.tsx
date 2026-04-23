import { useState, useEffect, useRef } from 'react'
import { CalendarioSup } from '../../components/calendarioSup/index'
import { slotsService } from '../../services/slots.service'
import { spotsService } from '../../services/spots.service'
import type { Slot, Spot } from '../../types'
import './styles.css'

export function SupervisorPage({ auth }: any) {
  const [slots, setSlots] = useState<Slot[]>([])
  const [spots, setSpots] = useState<Spot[]>([])
  const [spotsVisibles, setSpotsVisibles] = useState<Set<string>>(new Set())

  useEffect(() => {
    spotsService.getAll().then(data => {
      setSpots(data)
      setSpotsVisibles(new Set(data.map((s: Spot) => s.id)))
    })
  }, [])

  async function cargarSlots(desde: string) {
    const anho = parseInt(desde.slice(0, 4))
    const mes  = parseInt(desde.slice(5, 7))
    const data = await slotsService.getPorMes(anho, mes)
    setSlots(data)
  }

  return (
    <div className="supervisor-page">
      <CalendarioSup
        slots={slots}
        spots={spots}
        spotsVisibles={spotsVisibles}
        onCeldaClick={(fecha, hora) => console.log('crear:', fecha, hora)}
        onSlotClick={(slot) => console.log('slot:', slot)}
        onSemanaCambia={(desde) => cargarSlots(desde)}
      />
    </div>
  )
}