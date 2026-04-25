import { useState, useEffect } from 'react'
import type { Spot } from '../../types'
import type { SlotType } from '../../types/index'
import '../ModalCrearSlot/styles.css'

const HORAS = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`)

interface Props {
  open: boolean
  spots: Spot[]
  slotTypes: SlotType[]
  onConfirm: (data: {
    desde: string; hasta: string
    horaInicio: string; horaFin: string
    id_spot: string; type: string
  }) => void
  onClose: () => void
}

export function ModalCrearRango({ open, spots, slotTypes, onConfirm, onClose }: Props) {
  const [desde, setDesde]           = useState('')
  const [hasta, setHasta]           = useState('')
  const [horaInicio, setHoraInicio] = useState('08:00')
  const [horaFin, setHoraFin]       = useState('09:00')
  const [idSpot, setIdSpot]         = useState('')
  const [type, setType]             = useState('')

  useEffect(() => {
    if (spots.length)     setIdSpot(spots[0].id)
    if (slotTypes.length) setType(slotTypes[0].nombre)
  }, [spots, slotTypes])

  if (!open) return null

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>

        <div className="modal-header">
          <h3 className="modal-titulo">Crear slots por rango</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <label className="modal-label">Desde</label>
        <input className="modal-select" type="date" value={desde} onChange={e => setDesde(e.target.value)} />

        <label className="modal-label">Hasta</label>
        <input className="modal-select" type="date" value={hasta} onChange={e => setHasta(e.target.value)} />

        <label className="modal-label">Hora inicio</label>
        <select className="modal-select" value={horaInicio} onChange={e => setHoraInicio(e.target.value)}>
          {HORAS.map(h => <option key={h} value={h}>{h}</option>)}
        </select>

        <label className="modal-label">Hora fin</label>
        <select className="modal-select" value={horaFin} onChange={e => setHoraFin(e.target.value)}>
          {HORAS.map(h => <option key={h} value={h}>{h}</option>)}
        </select>

        <label className="modal-label">Spot</label>
        <select className="modal-select" value={idSpot} onChange={e => setIdSpot(e.target.value)}>
          {spots.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
        </select>

        <label className="modal-label">Tipo</label>
        <select className="modal-select" value={type} onChange={e => setType(e.target.value)}>
          {slotTypes.map(t => <option key={t.id} value={t.nombre}>{t.nombre} ({t.duracion}min)</option>)}
        </select>

        <div className="modal-actions">
          <button className="modal-btn modal-btn--ghost" onClick={onClose}>Cancelar</button>
          <button className="modal-btn modal-btn--primary" onClick={() => onConfirm({ desde, hasta, horaInicio, horaFin, id_spot: idSpot, type })}>
            Crear
          </button>
        </div>

      </div>
    </div>
  )
}