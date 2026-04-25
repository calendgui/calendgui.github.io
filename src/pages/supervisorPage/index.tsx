import { useState, useEffect } from 'react'
import { CalendarioSup } from '../../components/calendarioSup/index'
import { ModalCrearSlot } from '../../components/modalCrearSlot'
import { ModalSlotDetails } from '../../components/modalSlotDetails/index'
import { slotsService } from '../../services/slots.service'
import { spotsService } from '../../services/spots.service'
import { slotsTypeService } from '../../services/slotsType.service'
import type { Slot, Spot, SlotType } from '../../types'
import { ModalCrearRango } from '../../components/modalCrearRango'

import './styles.css'

export function SupervisorPage({ auth, mostrarToast, modalRango, onCerrarRango }: any) {
  console.log(auth)
  const [slots, setSlots]               = useState<Slot[]>([])
  const [spots, setSpots]               = useState<Spot[]>([])
  const [spotsVisibles, setSpotsVisibles] = useState<Set<string>>(new Set())
  const [slotTypes, setSlotTypes]       = useState<SlotType[]>([])
  const [modal, setModal]               = useState<{ fecha: string; hora: string } | null>(null)
  const [slotSeleccionado, setSlotSeleccionado] = useState<Slot | null>(null)
  const [semanaDesde, setSemanaDesde]   = useState('')

  useEffect(() => {
    spotsService.getAll().then(data => {
      setSpots(data)
      setSpotsVisibles(new Set(data.map((s: Spot) => s.id)))
    })
    slotsTypeService.getAll().then(setSlotTypes)
  }, [])

  async function cargarSlots(desde: string) {
    setSemanaDesde(desde)
    const anho = parseInt(desde.slice(0, 4))
    const mes  = parseInt(desde.slice(5, 7))
    const data = await slotsService.getMios(anho, mes)
    setSlots(data)
  }

  return (
    <div className="supervisor-page">
      <CalendarioSup
        slots={slots}
        spots={spots}
        spotsVisibles={spotsVisibles}
        onCeldaClick={(fecha, hora) => setModal({ fecha, hora })}
        onSlotClick={(slot) => setSlotSeleccionado(slot)}
        onSemanaCambia={(desde) => cargarSlots(desde)}
      />

      <ModalCrearSlot
        open={!!modal}
        fecha={modal?.fecha ?? ''}
        hora={modal?.hora ?? ''}
        spots={spots}
        slotTypes={slotTypes}
        onClose={() => setModal(null)}
        onConfirm={async (data) => {
          try {
            await slotsService.crear(data)
            setModal(null)
            mostrarToast('Slot creado')
            cargarSlots(semanaDesde)
          } catch (e: any) {
            mostrarToast(e.message, 'error')
          }
        }}
      />

      <ModalSlotDetails
        open={!!slotSeleccionado}
        slot={slotSeleccionado}
        spots={spots}
        onClose={() => setSlotSeleccionado(null)}
        onCrear={(fecha, hora) => { setSlotSeleccionado(null); setModal({ fecha, hora }) }}
        onLiberar={async (slot) => { await slotsService.liberar(slot.id); setSlotSeleccionado(null); cargarSlots(semanaDesde) }}
        onEliminar={async (slot) => { await slotsService.eliminar(slot.id); setSlotSeleccionado(null); cargarSlots(semanaDesde) }}
      />

      <ModalCrearRango
        open={modalRango}
        spots={spots}
        slotTypes={slotTypes}
        onClose={onCerrarRango}
        onConfirm={async (data) => {
          try {
            await slotsService.crearRango(data)
            onCerrarRango()
            mostrarToast('Slots creados')
            cargarSlots(semanaDesde)
          } catch (e: any) {
            mostrarToast(e.message, 'error')
          }
        }}
      />
    </div>
  )
}