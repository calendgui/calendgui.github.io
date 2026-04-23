import { useAuth } from './hooks/useAuth'
import { Header } from './components/header/index.tsx'
import { HomePage } from './pages/HomePage/index.tsx'
import { ParticipantePage } from './pages/participantePage/index.tsx'
import { SupervisorPage } from './pages/supervisorPage/index.tsx'

export default function App() {
  const auth = useAuth()

  if (auth.loading) return null

  const renderPage = () => {
    if (!auth.user) return <HomePage auth={auth} />
    
    switch(auth.user.rol) {
      case 2:
      case 3: return <SupervisorPage auth={auth} />
      case 1: return <ParticipantePage auth={auth} />
      default: return <HomePage auth={auth} /> // rol 0, sin acceso aún
    }
  }

  return (
    <>
      <Header auth={auth} />
      {renderPage()}
    </>
  )
}