import { useState, useEffect } from 'react'
import type { UserConfig } from '../../types'
import '../ModalCrearSlot/styles.css'
import './styles.css'

const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
const HORAS = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`)

interface Props {
  open: boolean
  config: UserConfig | null
  onConfirm: (data: Partial<UserConfig>) => void
  onClose: () => void
}

export function ModalUserConfig({ open, config, onConfirm, onClose }: Props) {
  const [diasBloqueados, setDiasBloqueados]     = useState<number[]>([])
  const [horasBloqueadas, setHorasBloqueadas]   = useState<string[]>([])
  const [fechasBloqueadas, setFechasBloqueadas] = useState<string[]>([])
  const [nuevaFecha, setNuevaFecha]             = useState('')

  useEffect(() => {
    if (!config) return
    setDiasBloqueados(config.dias_bloqueados)
    setHorasBloqueadas(config.horas_bloqueadas)
    setFechasBloqueadas(config.fechas_bloqueadas)
  }, [config])

  if (!open) return null

  const toggleDia = (dia: number) =>
    setDiasBloqueados(prev => prev.includes(dia) ? prev.filter(d => d !== dia) : [...prev, dia])

  const toggleHora = (hora: string) =>
    setHorasBloqueadas(prev => prev.includes(hora) ? prev.filter(h => h !== hora) : [...prev, hora])

  const agregarFecha = () => {
    if (!nuevaFecha || fechasBloqueadas.includes(nuevaFecha)) return
    setFechasBloqueadas(prev => [...prev, nuevaFecha])
    setNuevaFecha('')
  }

  const quitarFecha = (fecha: string) =>
    setFechasBloqueadas(prev => prev.filter(f => f !== fecha))

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal-card modal-card--lg" onClick={e => e.stopPropagation()}>

        <div className="modal-header">
          <h3 className="modal-titulo">Mi configuración</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <label className="modal-label">Días bloqueados</label>
        <div className="config-dias">
          {DIAS.map((dia, i) => (
            <button
              key={i}
              className={`config-dia-btn ${diasBloqueados.includes(i) ? 'config-dia-btn--activo' : ''}`}
              onClick={() => toggleDia(i)}
            >
              {dia.slice(0, 3)}
            </button>
          ))}
        </div>

        <label className="modal-label">Horas bloqueadas</label>
        <div className="config-horas">
          {HORAS.map(hora => (
            <button
              key={hora}
              className={`config-hora-btn ${horasBloqueadas.includes(hora) ? 'config-hora-btn--activo' : ''}`}
              onClick={() => toggleHora(hora)}
            >
              {hora}
            </button>
          ))}
        </div>

        <label className="modal-label">Fechas bloqueadas</label>
        <div className="config-fecha-row">
          <input
            className="modal-select"
            type="date"
            value={nuevaFecha}
            onChange={e => setNuevaFecha(e.target.value)}
          />
          <button className="modal-btn modal-btn--primary" onClick={agregarFecha}>+</button>
        </div>
        <div className="config-fechas">
          {fechasBloqueadas.map(f => {
            const [a, m, d] = f.split('-')
            return (
              <span key={f} className="config-fecha-chip">
                {d}/{m}/{a}
                <button onClick={() => quitarFecha(f)}>✕</button>
              </span>
            )
          })}
        </div>

        <div className="modal-actions">
          <button className="modal-btn modal-btn--ghost" onClick={onClose}>Cancelar</button>
          <button className="modal-btn modal-btn--primary" onClick={() => onConfirm({
            dias_bloqueados: diasBloqueados,
            horas_bloqueadas: horasBloqueadas,
            fechas_bloqueadas: fechasBloqueadas,
          })}>
            Guardar
          </button>
        </div>

      </div>
    </div>
  )
}