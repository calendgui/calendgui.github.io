import { useState } from 'react'
import { useAuth } from './hooks/useAuth'
import { Header } from './components/header/index.tsx'
import { HomePage } from './pages/HomePage/index.tsx'
import { ParticipantePage } from './pages/participantePage/index.tsx'
import { SupervisorPage } from './pages/supervisorPage/index.tsx'
import { Toast } from './components/toast/index.tsx'

export default function App() {
  const auth = useAuth()
  const [toast, setToast] = useState<{ mensaje: string; tipo: 'ok' | 'error' } | null>(null)

  const mostrarToast = (mensaje: string, tipo: 'ok' | 'error' = 'ok') => {
    setToast({ mensaje, tipo })
  }

  if (auth.loading) return null

  const renderPage = () => {
    if (!auth.user) return <HomePage auth={auth} />
    
    switch(auth.user.rol) {
      case 2:
      case 3: return <SupervisorPage auth={auth} mostrarToast={mostrarToast} />
      case 1: return <ParticipantePage auth={auth} mostrarToast={mostrarToast} />
      default: return <HomePage auth={auth} />
    }
  }

  return (
    <>
      <Header auth={auth} />
      {renderPage()}
      {toast && <Toast mensaje={toast.mensaje} tipo={toast.tipo} onClose={() => setToast(null)} />}
    </>
  )
}