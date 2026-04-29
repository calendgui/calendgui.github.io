import { useState, useEffect } from 'react'
import type { Spot, SlotType } from '../../types'

import './styles.css'

interface Props {
  open: boolean
  fecha: string
  hora: string
  spots: Spot[]
  slotTypes: SlotType[]
  onConfirm: (data: { fecha: string; hora: string; id_spot: string; type: string }) => void
  onClose: () => void
}

function generarOpciones(): string[] {
  const opciones: string[] = []
  for (let h = 0; h < 24; h++) {
    for (const m of [0, 15, 30, 45]) {
      opciones.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
    }
  }
  return opciones
}

const OPCIONES_HORA = generarOpciones()

// redondea al cuarto de hora más cercano hacia abajo: "09:23" → "09:15"
function redondearA15(hora: string): string {
  const [h, m] = hora.split(':').map(Number)
  const redondeado = Math.floor(m / 15) * 15
  return `${String(h).padStart(2, '0')}:${String(redondeado).padStart(2, '0')}`
}

export function ModalCrearSlot({ open, fecha, hora, spots, slotTypes, onConfirm, onClose }: Props) {
  const [idSpot,  setIdSpot]  = useState('')
  const [type,    setType]    = useState('')
  const [horaVal, setHoraVal] = useState(() => redondearA15(hora))

  useEffect(() => {
    if (spots.length)     setIdSpot(spots[0].id)
    if (slotTypes.length) setType(slotTypes[0].nombre)
  }, [spots, slotTypes])

  useEffect(() => {
    setHoraVal(redondearA15(hora))
  }, [hora])

  if (!open) return null

  const [a, m, d] = fecha.split('-')
  const fechaLabel = `${d}/${m}/${a}`

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>

        <div className="modal-header">
          <h3 className="modal-titulo">Nuevo slot · {fechaLabel}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <label className="modal-label">Hora</label>
        <select className="modal-select" value={horaVal} onChange={e => setHoraVal(e.target.value)}>
          {OPCIONES_HORA.map(h => (
            <option key={h} value={h}>{h}</option>
          ))}
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
          <button
            className="modal-btn modal-btn--primary"
            onClick={() => onConfirm({ fecha, hora: horaVal, id_spot: idSpot, type })}
          >
            Crear
          </button>
        </div>

      </div>
    </div>
  )
}