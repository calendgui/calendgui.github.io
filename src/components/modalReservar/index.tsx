import { useEffect, useState } from 'react'
import type { Slot, Spot, Challenge } from '../../types'
import { chAllowedService } from '../../services/chAllowed.service'
import '../ModalCrearSlot/styles.css'

interface Props {
  open: boolean
  slot: Slot | null
  spots: Spot[]
  onConfirm: (data: { id_slot: string; id_challenge: string }) => void
  onClose: () => void
}

export function ModalReservar({ open, slot, spots, onConfirm, onClose }: Props) {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [challenge, setChallenge]   = useState('')

  useEffect(() => {
    if (!slot) return
    chAllowedService.getByUid(slot.id_supervisor).then(data => {
      setChallenges(data)
      if (data.length) setChallenge(data[0].id)
    })
  }, [slot])

  if (!open || !slot) return null

  const spot = spots.find(s => s.id === slot.id_spot)
  const [a, m, d] = slot.fecha.split('-')

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>

        <div className="modal-header">
          <h3 className="modal-titulo">Confirmar reserva</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-slot-fila" style={{ marginBottom: '1rem' }}>
          <span className="modal-slot-key">Fecha</span>
          <span>{d}/{m}/{a}</span>
        </div>
        <div className="modal-slot-fila" style={{ marginBottom: '1rem' }}>
          <span className="modal-slot-key">Hora</span>
          <span>{slot.hora}</span>
        </div>
        <div className="modal-slot-fila" style={{ marginBottom: '1rem' }}>
          <span className="modal-slot-key">Spot</span>
          <span>{spot?.nombre ?? slot.id_spot}</span>
        </div>
        <div className="modal-slot-fila" style={{ marginBottom: '1rem' }}>
          <span className="modal-slot-key">Tipo</span>
          <span>{slot.type}</span>
        </div>
        <div className="modal-slot-fila" style={{ marginBottom: '1.25rem' }}>
          <span className="modal-slot-key">Supervisor</span>
          <span>{slot.nombre_supervisor}</span>
        </div>

        <label className="modal-label">Challenge</label>
        <select className="modal-select" value={challenge} onChange={e => setChallenge(e.target.value)}>
          {challenges.map(c => (
            <option key={c.id} value={c.id}>{c.id} · {c.etapa} · {c.nombre}</option>
          ))}
        </select>

        <div className="modal-actions">
          <button className="modal-btn modal-btn--ghost" onClick={onClose}>Cancelar</button>
          <button
            className="modal-btn modal-btn--primary"
            onClick={() => onConfirm({ id_slot: slot.id, id_challenge: challenge })}
          >
            Confirmar
          </button>
        </div>

      </div>
    </div>
  )
}