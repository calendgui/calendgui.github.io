import { useState, useEffect, useMemo } from 'react'
import type { Slot, Spot } from '../../types'
import './styles.css'

const DIAS_CORTO = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
const HORA_HEIGHT = 64 // px por hora
const TOTAL_HEIGHT = 24 * HORA_HEIGHT
const HORAS = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`)

interface Props {
  slots: Slot[]
  spots: Spot[]
  spotsVisibles: Set<string>
  onCeldaClick: (fecha: string, hora: string) => void
  onSlotClick: (slot: Slot) => void
  onSemanaCambia: (desde: string, hasta: string) => void
}

function calcularColumnas(slots: Slot[]) {
  const resultado = new Map<string, { col: number; total: number }>()
  
  // agrupar por fecha+hora
  const grupos = new Map<string, Slot[]>()
  slots.forEach(slot => {
    const key = `${slot.fecha}-${slot.hora}`
    if (!grupos.has(key)) grupos.set(key, [])
    grupos.get(key)!.push(slot)
  })

  grupos.forEach(grupo => {
    grupo.forEach((slot, i) => {
      resultado.set(slot.id, { col: i, total: grupo.length })
    })
  })

  return resultado
}

function toFechaStr(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function getSemana(offset: number) {
  const hoy = new Date()
  const domingo = new Date(hoy)
  domingo.setDate(hoy.getDate() - hoy.getDay() + offset * 7)
  domingo.setHours(0, 0, 0, 0)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(domingo)
    d.setDate(domingo.getDate() + i)
    return d
  })
}

function horaAMinutos(hora: string) {
  const [h, m] = hora.split(':').map(Number)
  return h * 60 + m
}

export function CalendarioSup({ slots, spots, spotsVisibles, onCeldaClick, onSlotClick, onSemanaCambia }: Props) {
  const [offset, setOffset] = useState(0)
  const dias = useMemo(() => getSemana(offset), [offset])
  const hoy = new Date().toDateString()

  useEffect(() => {
    onSemanaCambia(toFechaStr(dias[0]), toFechaStr(dias[6]))
  }, [offset])

  function handleColumnClick(e: React.MouseEvent<HTMLDivElement>, fechaStr: string) {
    const rect = e.currentTarget.getBoundingClientRect()
    const y = e.clientY - rect.top + e.currentTarget.scrollTop
    const minutos = Math.floor(y / HORA_HEIGHT) * 60
    const hora = `${String(Math.floor(minutos / 60)).padStart(2, '0')}:00`
    onCeldaClick(fechaStr, hora)
  }

  const label = `${MESES[dias[0].getMonth()]} ${dias[0].getFullYear()}`

  return (
    <div className="cal-sup-wrapper">

    <div className="cal-sup-nav">
      <div className="cal-sup-nav-centro">
        <button className="cal-sup-nav-btn" onClick={() => setOffset(o => o - 1)}>‹</button>
        <span className="cal-sup-nav-label">{label}</span>
        <button className="cal-sup-nav-btn" onClick={() => setOffset(o => o + 1)}>›</button>
      </div>
    </div>

      <div className="cal-sup-scroll">
        <div className="cal-sup-grid">

          {/* cabecera */}
          <div className="cal-sup-corner" />
          {dias.map(fecha => (
            <div
              key={fecha.toISOString()}
              className={`cal-sup-header ${fecha.toDateString() === hoy ? 'cal-sup-header--hoy' : ''}`}
            >
              <span className="cal-sup-dia-nombre">{DIAS_CORTO[fecha.getDay()]}</span>
              <span className="cal-sup-dia-num">{fecha.getDate()}</span>
            </div>
          ))}

          {/* body */}
          <div className="cal-sup-horas">
            {HORAS.map(hora => (
              <div key={hora} className="cal-sup-hora-label" style={{ height: HORA_HEIGHT }}>
                {hora}
              </div>
            ))}
          </div>

          {dias.map(fecha => {
            const fechaStr = toFechaStr(fecha)
            const slotsDia = slots.filter(s =>
              s.fecha === fechaStr &&
              (spotsVisibles.size === 0 || spotsVisibles.has(s.id_spot))
            )
            const columnas = calcularColumnas(slotsDia)
            return (
              <div
                key={fechaStr}
                className="cal-sup-columna"
                style={{ height: TOTAL_HEIGHT }}
                onClick={(e) => handleColumnClick(e, fechaStr)}
              >
                {/* líneas de hora */}
                {HORAS.map(hora => (
                  <div key={hora} className="cal-sup-linea" style={{ top: horaAMinutos(hora) / 60 * HORA_HEIGHT }} />
                ))}

                {/* slots */}
                

                {slotsDia.map(slot => {
                  const spot = spots.find(s => s.id === slot.id_spot)
                  const top = horaAMinutos(slot.hora) / 60 * HORA_HEIGHT
                  const height = ((slot.duracion ?? 60) / 60) * HORA_HEIGHT
                  const { col, total } = columnas.get(slot.id) ?? { col: 0, total: 1 }
                  const width = `calc((100% - 4px) / ${total})`
                  const left = `calc(${col} * (100% - 4px) / ${total} + 2px)`

                  return (
                    <div
                      key={slot.id}
                      className={`cal-sup-chip ${slot.estado ? 'cal-sup-chip--ocupado' : 'cal-sup-chip--libre'}`}
                      style={{ top, height, width, left, background: spot?.color ?? '#94a3b8' }}
                      onClick={(e) => { e.stopPropagation(); onSlotClick(slot) }}
                    >
                      <span className="cal-sup-chip-hora">{slot.hora}</span>
                      <span className="cal-sup-chip-nombre">{spot?.nombre ?? slot.id_spot}</span>
                    </div>
                  )
                })}
              </div>
            )
          })}

        </div>
      </div>
    </div>
  )
}