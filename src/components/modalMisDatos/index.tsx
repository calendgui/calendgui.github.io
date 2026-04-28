import { useState } from 'react'
import '../ModalCrearSlot/styles.css'

interface Props {
  open: boolean
  onConfirm: (data: { ci: string; batch: number }) => void
  onClose: () => void
}

export function ModalMisDatos({ open, onConfirm, onClose }: Props) {
  const [ci, setCi]       = useState('')
  const [batch, setBatch] = useState('')

  if (!open) return null

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>

        <div className="modal-header">
          <h3 className="modal-titulo">Mis datos</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <label className="modal-label">Número de CI</label>
        <input
          className="modal-select"
          type="text"
          
          value={ci}
          onChange={e => setCi(e.target.value)}
        />

        <label className="modal-label">Batch</label>
        <input
          className="modal-select"
          type="number"
          
          value={batch}
          onChange={e => setBatch(e.target.value)}
        />

        <div className="modal-actions">
          <button className="modal-btn modal-btn--ghost" onClick={onClose}>Cancelar</button>
          <button
            className="modal-btn modal-btn--primary"
            onClick={() => onConfirm({ ci, batch: parseInt(batch) })}
          >
            Guardar
          </button>
        </div>

      </div>
    </div>
  )
}