import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import logo from '../../assets/logo.png'
import './styles.css'

type Vista = 'supervisor' | 'participante' | 'home'

type Props = {
  auth: ReturnType<typeof useAuth>
  onCrearRango?: () => void
  onUserConfig?: () => void
  onVistaSuper?: () => void
  onMisReservas?: () => void
  onMisDatos?: () => void
  onHome?: () => void
  vista: Vista
}

export function Header({ auth, onCrearRango, onUserConfig, onVistaSuper, onMisReservas, onMisDatos, onHome, vista }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, login, logout } = auth

  return (
    <nav className="nav">
      <button className="nav-brand" onClick={onHome}>
        <img src={logo} alt="CalendGüi" className="nav-logo" />
      </button>

      <div className="nav-right">
        {user && <img src={user.foto} alt={user.nombre} className="nav-avatar" referrerPolicy="no-referrer" />}
        <button className="nav-menu-btn" onClick={() => setMenuOpen(true)}>☰</button>
      </div>

      {menuOpen && <div className="nav-backdrop" onClick={() => setMenuOpen(false)} />}

      <div className={`nav-menu ${menuOpen ? 'open' : ''}`}>

        <div className="nav-menu-header">
          <span className="nav-menu-titulo">Menú</span>
          <button className="nav-menu-close" onClick={() => setMenuOpen(false)}>✕</button>
        </div>

        <div className="nav-menu-body">
          {user && (
            <>
              <div className="nav-menu-user">
                <img src={user.foto} alt={user.nombre} className="nav-menu-avatar" referrerPolicy="no-referrer" />
                <div>
                  <p className="nav-menu-nombre">{user.nombre}</p>
                  <p className="nav-menu-email">{user.email}</p>
                </div>
              </div>
                {vista === 'home' && (
                <>
                  <button className="nav-menu-item" onClick={() => { setMenuOpen(false); onMisDatos?.() }}>Mis datos</button>
                  {(user.rol === 2 || user.rol === 3) && (
                    <button className="nav-menu-item" onClick={() => { setMenuOpen(false); onVistaSuper?.() }}>Vista supervisor</button>
                  )}
                  {(user.rol === 2 || user.rol === 3)
                    ? <button className="nav-menu-item" onClick={() => { setMenuOpen(false); onMisReservas?.() }}>Vista calendario</button>
                    : <button className="nav-menu-item" onClick={() => { setMenuOpen(false); onMisReservas?.() }}>Ir al calendario</button>
                  }
                </>
              )}
              {vista === 'participante' && (
                <>
                  <button className="nav-menu-item" onClick={() => { setMenuOpen(false); onMisDatos?.() }}>Mis datos</button>
                  {(user.rol === 2 || user.rol === 3) && (
                    <button className="nav-menu-item" onClick={() => { setMenuOpen(false); onVistaSuper?.() }}>Vista supervisor</button>
                  )}
                </>
              )}
              {vista === 'supervisor' && (
                <>
                  <button className="nav-menu-item" onClick={() => { setMenuOpen(false); onMisDatos?.() }}>Mis datos</button>
                  <button className="nav-menu-item" onClick={() => { setMenuOpen(false); onMisReservas?.() }}>Vista calendario</button>
                  <button className="nav-menu-item" onClick={() => { setMenuOpen(false); onCrearRango?.() }}>Crear rango</button>
                  <button className="nav-menu-item" onClick={() => { setMenuOpen(false); onUserConfig?.() }}>Mi configuración</button>
                </>
              )}
            </>
          )}
          {!user
            ? <button className="nav-menu-item" onClick={() => { login(); setMenuOpen(false) }}>Iniciar sesión con Google</button>
            : <button className="nav-menu-item nav-menu-item-danger" onClick={() => { logout(); setMenuOpen(false) }}>Cerrar sesión</button>
          }
        </div>

      </div>
    </nav>
  )
}