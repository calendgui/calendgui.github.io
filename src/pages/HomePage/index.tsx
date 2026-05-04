import { useState, useEffect } from 'react'
import { announcementsService } from '../../services/announcements.service'
import type { Anuncio } from '../../types'
import './styles.css'

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
               'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

interface Props {
  auth: any
  onIrCalendario?: () => void
  onIrSupervisor?: () => void
}

export function HomePage({ auth, onIrCalendario, onIrSupervisor }: Props) {
  const { user, login } = auth
  const hoy = new Date()
  const fecha = `${hoy.getDate()} de ${MESES[hoy.getMonth()]} ${hoy.getFullYear()}`
  const [anuncios, setAnuncios] = useState<Anuncio[]>([])
  const [anuncioActivo, setAnuncioActivo] = useState(0)

  useEffect(() => {
    announcementsService.getAll().then(setAnuncios)
  }, [])

  useEffect(() => {
    if (anuncios.length === 0) return
    const t = setInterval(() => {
      setAnuncioActivo(i => (i + 1) % anuncios.length)
    }, 3500)
    return () => clearInterval(t)
  }, [anuncios])

  return (
    <div className="home">

      {/* ── columna izquierda / hero ── */}
      <div className="home-hero">
        <p className="home-fecha">{fecha}</p>
        <h1 className="home-slogan">
          Tu tiempo<br />mejor<br />organizado.
        </h1>

        <div className="home-acciones">
          {!user ? (
            <button className="home-btn home-btn--primary" onClick={login}>
              Iniciar sesión con Google
            </button>
          ) : (
            <>
              <p className="home-bienvenida">Hola, <strong>{user.nombre.split(' ')[0]}</strong> 👋</p>
              <button className="home-btn home-btn--primary" onClick={onIrCalendario}>
                Ir al calendario
              </button>
              {(user.rol === 2 || user.rol === 3) && (
                <button className="home-btn home-btn--secondary" onClick={onIrSupervisor}>
                  Vista supervisor
                </button>
              )}
            </>
          )}
        </div>
      </div>

{/* ── anuncios ── */}
      <div className="home-anuncios">
        {anuncios.length === 0 ? (
          <div className="home-anuncio-empty">Sin anuncios por ahora</div>
        ) : (
          <>
            <div className="home-anuncio-card">
              <img
                src={anuncios[anuncioActivo].img_url}
                alt={anuncios[anuncioActivo].titulo}
                className="home-anuncio-img"
              />
              <div className="home-anuncio-body">
                <p className="home-anuncio-titulo">{anuncios[anuncioActivo].titulo}</p>
              </div>
            </div>
            <div className="home-anuncio-dots">
              {anuncios.map((_, i) => (
                <button
                  key={i}
                  className={`home-dot ${i === anuncioActivo ? 'home-dot--activo' : ''}`}
                  onClick={() => setAnuncioActivo(i)}
                />
              ))}
            </div>
          </>
        )}
      </div>

    </div>
  )
}