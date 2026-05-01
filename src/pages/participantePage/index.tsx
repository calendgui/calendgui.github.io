import { useState, useEffect } from 'react'
import { CalendarioMes } from '../../components/calendarioMes'
import { PanelDia } from '../../components/panelDia'
import { ModalReservar } from '../../components/modalReservar'
import { slotsService } from '../../services/slots.service'
import { spotsService } from '../../services/spots.service'
import { reservationService } from '../../services/reservation.services'
import { MisReservas } from '../../components/misReservas'
import type { Slot, Spot } from '../../types'
import './styles.css'

export function ParticipantePage({ auth, mostrarToast }: any) {
  const [slots, setSlots]               = useState<Slot[]>([])
  const [spots, setSpots]               = useState<Spot[]>([])
  const [fechaSel, setFechaSel]         = useState<string | null>(null)
  const [slotsDia, setSlotsDia]         = useState<Slot[]>([])
  const [slotAReservar, setSlotAReservar] = useState<Slot | null>(null)
  const [mesActual, setMesActual]       = useState({ anho: new Date().getFullYear(), mes: new Date().getMonth() + 1 })
  const [tab, setTab]                   = useState<'agendar' | 'mis-reservas'>('agendar')

  useEffect(() => {
    spotsService.getAll().then(setSpots)
    cargarSlots(mesActual.anho, mesActual.mes)
  }, [])

  async function cargarSlots(anho: number, mes: number) {
    setMesActual({ anho, mes })
    const data = await slotsService.getPorMes(anho, mes)
    setSlots(data.filter(s => !s.estado))
  }

  return (
    <div className="participante-page">

      <div className="participante-tabs">
        <button
          className={`participante-tab ${tab === 'agendar' ? 'active' : ''}`}
          onClick={() => setTab('agendar')}
        >
          Agendar
        </button>
        <button
          className={`participante-tab ${tab === 'mis-reservas' ? 'active' : ''}`}
          onClick={() => setTab('mis-reservas')}
        >
          Mis reservas
        </button>
      </div>

      {tab === 'agendar' ? (
        <>
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
            onReservar={(slot) => setSlotAReservar(slot)}
          />

          <ModalReservar
            open={!!slotAReservar}
            slot={slotAReservar}
            spots={spots}
            onClose={() => setSlotAReservar(null)}
            onConfirm={async (data) => {
              try {
                await reservationService.crear(data)
                setSlotAReservar(null)
                setFechaSel(null)
                mostrarToast('Reserva confirmada')
                cargarSlots(mesActual.anho, mesActual.mes)
              } catch (e: any) {
                mostrarToast(e.message, 'error')
              }
            }}
          />
        </>
      ) : (
        // MisReservas va acá — próximo paso
        <MisReservas
          spots={spots}
          mostrarToast={mostrarToast}
        />
      )}

    </div>
  )
}