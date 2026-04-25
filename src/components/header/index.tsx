import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import './styles.css'

type Props = {
  auth: ReturnType<typeof useAuth>
  onCrearRango?: () => void
  onUserConfig?: () => void
}

export function Header({ auth, onCrearRango, onUserConfig }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, login, logout } = auth

  return (
    <nav className="nav">
      <div className="nav-brand">
        <img src="https://lh3.googleusercontent.com/d/1ZFVOuBX8oWOlM53Q4AzTXH60wvwoWUHU" alt="CalendGüi" className="nav-logo" />
      </div>

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
              <hr className="nav-menu-divider" />
              <button className="nav-menu-item" onClick={() => setMenuOpen(false)}>Mis reservas</button>
              {(user.rol === 2 || user.rol === 3) && (
                <>
                  <button className="nav-menu-item" onClick={() => { setMenuOpen(false); onCrearRango?.() }}>Crear rango</button>
                  <button className="nav-menu-item" onClick={() => { setMenuOpen(false); onUserConfig?.() }}>Mi configuración</button>
                </>
              )}
            </>
          )}
        </div>

        <div className="nav-menu-footer">
          {!user
            ? <button className="nav-menu-item" onClick={() => { login(); setMenuOpen(false) }}>Iniciar sesión con Google</button>
            : <button className="nav-menu-item nav-menu-item-danger" onClick={() => { logout(); setMenuOpen(false) }}>Cerrar sesión</button>
          }
        </div>

      </div>
    </nav>
  )
}