import { useState, useRef, useEffect } from 'react'
import type { Spot } from '../../types'
import './styles.css'

interface Props {
  spots: Spot[]
  spotsVisibles: Set<string>
  verTodos: boolean
  onToggleSpot: (id: string) => void
  onToggleVerTodos: () => void
}

export function FiltrosSup({ spots, spotsVisibles, verTodos, onToggleSpot, onToggleVerTodos }: Props) {
  const [abierto, setAbierto] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setAbierto(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="filtros-sup" ref={ref}>
      <button className="filtros-sup-btn" onClick={() => setAbierto(a => !a)}>
        ⚙
      </button>

      {abierto && (
        <div className="filtros-sup-popover">
          <p className="filtros-sup-titulo">Filtros</p>

          <label className="filtros-sup-item">
            <input type="checkbox" checked={verTodos} onChange={onToggleVerTodos} />
            <span>Ver todos</span>
          </label>

          <hr className="filtros-sup-divider" />

          {spots.map(spot => (
            <label key={spot.id} className="filtros-sup-item">
              <input
                type="checkbox"
                checked={spotsVisibles.has(spot.id)}
                onChange={() => onToggleSpot(spot.id)}
              />
              <span className="filtros-sup-dot" style={{ background: spot.color }} />
              <span>{spot.nombre}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}