import type { Slot, Spot } from '../../types'
import './styles.css'

interface Props {
  open: boolean
  slot: Slot | null
  spots: Spot[]
  onClose: () => void
  onCrear: (fecha: string, hora: string) => void
  onLiberar: (slot: Slot) => void
  onEliminar: (slot: Slot) => void
}

export function ModalSlotDetails({ open, slot, spots, onClose, onCrear, onLiberar, onEliminar }: Props) {
  if (!open || !slot) return null

  const spot = spots.find(s => s.id === slot.id_spot)
  const [a, m, d] = slot.fecha.split('-')

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>

        {/* acciones arriba */}
        <div className="modal-slot-acciones">
          <button className="modal-slot-accion" title="Crear slot" onClick={() => onCrear(slot.fecha, slot.hora)}>
            ＋
          </button>
          {slot.estado && (
            <button className="modal-slot-accion modal-slot-accion--warning" title="Liberar" onClick={() => onLiberar(slot)}>
              ↩
            </button>
          )}
          <button className="modal-slot-accion modal-slot-accion--danger" title="Eliminar" onClick={() => onEliminar(slot)}>
            🗑
          </button>
          <button className="modal-slot-accion modal-slot-accion--close" onClick={onClose}>✕</button>
        </div>

        {/* info */}
        <div className="modal-slot-info">
          <p className="modal-slot-titulo">{slot.hora} · {spot?.nombre ?? slot.id_spot}</p>

          <div className="modal-slot-fila">
            <span className="modal-slot-key">Fecha</span>
            <span>{d}/{m}/{a}</span>
          </div>

          <div className="modal-slot-fila">
            <span className="modal-slot-key">Tipo</span>
            <span>{slot.type} · {slot.duracion}min</span>
          </div>

          <div className="modal-slot-fila">
            <span className="modal-slot-key">Estado</span>
            <span className={`modal-slot-badge ${slot.estado ? 'modal-slot-badge--ocupado' : 'modal-slot-badge--libre'}`}>
              {slot.estado ? 'Reservado' : 'Libre'}
            </span>
          </div>

          {slot.estado && (
            <>
              <div className="modal-slot-fila">
                <span className="modal-slot-key">Evaluado</span>
                <span>{slot.evaluado_nombre}</span>
              </div>
              <div className="modal-slot-fila">
                <span className="modal-slot-key">Email</span>
                <span>{slot.evaluado_mail}</span>
              </div>
              <div className="modal-slot-fila">
                <span className="modal-slot-key">Batch</span>
                <span>{slot.batch}</span>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  )
}