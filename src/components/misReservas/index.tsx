// components/misReservas/index.tsx
import { useState, useEffect } from 'react'
import { reservationService } from '../../services/reservation.services'
import type { Reservacion, Spot } from '../../types'
import './styles.css'

interface Props {
  spots: Spot[]
  mostrarToast: (msg: string, tipo?: string) => void
}

export function MisReservas({ spots, mostrarToast }: Props) {
  const hoy = new Date()
  const [anho, setAnho] = useState(hoy.getFullYear())
  const [mes, setMes]   = useState(hoy.getMonth() + 1)
  const [reservas, setReservas] = useState<Reservacion[]>([])
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    cargar(anho, mes)
  }, [anho, mes])

  async function cargar(a: number, m: number) {
    setCargando(true)
    try {
      const data = await reservationService.getMios(a, m)
      setReservas(data)
    } finally {
      setCargando(false)
    }
  }


  function cambiarMes(delta: number) {
    let m = mes + delta
    let a = anho
    if (m > 12) { m = 1;  a++ }
    if (m < 1)  { m = 12; a-- }
    setMes(m)
    setAnho(a)
  }

  function nombreSpot(id: string) {
    return spots.find(s => s.id === id)?.nombre ?? id
  }

//   const ahora = `${anho}-${String(mes).padStart(2, '0')}`
  const futuras = reservas.filter(r => r.fecha >= new Date().toISOString().slice(0, 10))
  const pasadas = reservas.filter(r => r.fecha <  new Date().toISOString().slice(0, 10))

  const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
                 'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

  return (
    <div className="mis-reservas">
      <div className="mis-reservas-nav">
        <button onClick={() => cambiarMes(-1)}>‹</button>
        <span>{MESES[mes - 1]} {anho}</span>
        <button onClick={() => cambiarMes(1)}>›</button>
      </div>

      {cargando && <p className="mis-reservas-cargando">Cargando…</p>}

      {!cargando && reservas.length === 0 && (
        <div className="mis-reservas-vacio">
          No tenés reservas este mes
        </div>
      )}

      {futuras.length > 0 && (
        <section>
          <h3 className="mis-reservas-seccion-titulo">Próximas</h3>
          <ul className="mis-reservas-lista">
            {futuras.map(r => (
              <ReservaCard
                key={r.id}
                reserva={r}
                spotNombre={nombreSpot(r.id_spot)}
                pasada={false}
              />
            ))}
          </ul>
        </section>
      )}

      {pasadas.length > 0 && (
        <section>
          <h3 className="mis-reservas-seccion-titulo">Pasadas</h3>
          <ul className="mis-reservas-lista">
            {pasadas.map(r => (
              <ReservaCard
                key={r.id}
                reserva={r}
                spotNombre={nombreSpot(r.id_spot)}
                pasada={true}
              />
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

// ── sub-componente ──────────────────────────────────────────────────────────

interface CardProps {
  reserva: Reservacion
  spotNombre: string
  pasada: boolean
  // onCancelar eliminado
}

function ReservaCard({ reserva, spotNombre, pasada }: CardProps) {
  return (
    <li className={`reserva-card ${pasada ? 'reserva-card--pasada' : ''}`}>
      <div className="reserva-card__info">
        <p className="reserva-card__titulo">
          {reserva.fecha} · {reserva.hora}
        </p>
        <p className="reserva-card__subtitulo">
          {reserva.type} · {reserva.nombre_supervisor} · {spotNombre}
        </p>
      </div>
      <span className={`reserva-card__badge ${pasada ? 'badge--pasada' : 'badge--activa'}`}>
        {pasada ? 'Pasada' : 'Confirmada'}
      </span>
    </li>
  )
}