import type { Slot, Spot } from '../../types'
import './styles.css'

const DIAS = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado']
const MESES_CORTO = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']

interface Props {
  fecha: string | null
  slots: Slot[]
  spots: Spot[]
  onCerrar: () => void
  onReservar: (slot: Slot) => void
}

export function PanelDia({ fecha, slots, spots, onCerrar, onReservar }: Props) {
  if (!fecha) return null

  const [a, m, d] = fecha.split('-')
  const fechaObj = new Date(parseInt(a), parseInt(m) - 1, parseInt(d))
  const titulo = `${DIAS[fechaObj.getDay()]} ${d} de ${MESES_CORTO[parseInt(m) - 1]}`

  const ordenados = [...slots].sort((a, b) => a.hora.localeCompare(b.hora))

  return (
    <div className="panel-dia panel-dia--open">
      <div className="panel-dia-header">
        <h3 className="panel-dia-titulo">{titulo}</h3>
        <button className="panel-dia-close" onClick={onCerrar}>✕</button>
      </div>

      <div className="panel-dia-lista">
        {!ordenados.length
          ? <p className="panel-dia-vacio">Sin slots disponibles este día</p>
          : ordenados.map(slot => {
              const spot = spots.find(s => s.id === slot.id_spot)
              return (
                <div
                  key={slot.id}
                  className="panel-dia-slot panel-dia-slot--libre"
                  onClick={() => onReservar(slot)}
                >
                  <span className="panel-dia-slot-hora">{slot.hora}</span>
                  <span className="panel-dia-slot-type">{slot.type}</span>
                  <span className="panel-dia-slot-sup">{slot.nombre_supervisor}</span>
                  <span className="panel-dia-slot-est">{spot?.nombre ?? slot.id_spot}</span>
                  <span className="panel-dia-slot-arrow">›</span>
                </div>
              )
            })
        }
      </div>
    </div>
  )
}