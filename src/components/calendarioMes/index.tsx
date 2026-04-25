import { useState, useMemo } from 'react'
import type { Slot } from '../../types'
import './styles.css'

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
const DIAS_CORTO = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb']

interface Props {
  slots: Slot[]
  onDiaClick: (fecha: string, slots: Slot[]) => void
  onMesCambia: (anho: number, mes: number) => void
}

function toFechaStr(anho: number, mes: number, dia: number) {
  return `${anho}-${String(mes).padStart(2,'0')}-${String(dia).padStart(2,'0')}`
}

export function CalendarioMes({ slots, onDiaClick, onMesCambia }: Props) {
  const [fecha, setFecha] = useState(() => {
    const h = new Date()
    return { anho: h.getFullYear(), mes: h.getMonth() }
  })

  const hoy = new Date()

  const { primerDia, totalDias } = useMemo(() => ({
    primerDia: new Date(fecha.anho, fecha.mes, 1).getDay(),
    totalDias: new Date(fecha.anho, fecha.mes + 1, 0).getDate(),
  }), [fecha])

  const navegar = (delta: number) => {
    setFecha(prev => {
      const d = new Date(prev.anho, prev.mes + delta, 1)
      const nuevo = { anho: d.getFullYear(), mes: d.getMonth() }
      onMesCambia(nuevo.anho, nuevo.mes + 1)
      return nuevo
    })
  }

  return (
    <div className="cal-wrapper">
      <div className="cal-nav">
        <button className="cal-nav-btn" onClick={() => navegar(-1)}>‹</button>
        <span className="cal-nav-label">{MESES[fecha.mes]} {fecha.anho}</span>
        <button className="cal-nav-btn" onClick={() => navegar(1)}>›</button>
      </div>

      <div className="cal-weekdays">
        {DIAS_CORTO.map(d => <span key={d} className="cal-weekday">{d}</span>)}
      </div>

      <div className="cal-grid">
        {Array.from({ length: primerDia }, (_, i) => (
          <div key={`empty-${i}`} className="cal-cell cal-cell--empty" />
        ))}

        {Array.from({ length: totalDias }, (_, i) => {
          const dia = i + 1
          const fechaStr = toFechaStr(fecha.anho, fecha.mes + 1, dia)
          const esPasado = new Date(fecha.anho, fecha.mes, dia) < new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())
          const esHoy = hoy.getFullYear() === fecha.anho && hoy.getMonth() === fecha.mes && hoy.getDate() === dia
          const slotsDia = slots.filter(s => s.fecha === fechaStr && !s.estado)
          const tieneSlots = slotsDia.length > 0

          return (
            <div
              key={dia}
              className={[
                'cal-cell',
                esHoy ? 'cal-cell--hoy' : '',
                esPasado ? 'cal-cell--pasado' : '',
                tieneSlots ? 'cal-cell--activo' : '',
              ].join(' ')}
              onClick={() => !esPasado && onDiaClick(fechaStr, slotsDia)}
            >
              <span className="cal-cell-num">{dia}</span>
              {tieneSlots && (
                <div className="cal-cell-dots">
                  <span className="cal-dot cal-dot--libre" />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}