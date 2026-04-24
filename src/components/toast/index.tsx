import { useEffect } from 'react'
import './styles.css'

interface Props {
  mensaje: string
  tipo?: 'ok' | 'error'
  onClose: () => void
}

export function Toast({ mensaje, tipo = 'ok', onClose }: Props) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000)
    return () => clearTimeout(t)
  }, [mensaje])

  return (
    <div className={`toast toast--${tipo}`}>
      {mensaje}
    </div>
  )
}