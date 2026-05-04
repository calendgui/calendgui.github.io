import { useState } from 'react'
import { useAuth } from './hooks/useAuth'
import { Header } from './components/header/index.tsx'
import { HomePage } from './pages/HomePage/index.tsx'
import { ParticipantePage } from './pages/participantePage/index.tsx'
import { SupervisorPage } from './pages/supervisorPage/index.tsx'
import { Toast } from './components/toast/index.tsx'
import { ModalUserConfig } from './components/modalUserConfig/index.tsx'
import { userConfigService } from './services/userConfig.service.ts'
import type { UserConfig } from './types/index.ts'
import { ModalMisDatos } from './components/modalMisDatos/index.tsx'
import { usersService } from './services/user.service.ts'


type Vista = 'supervisor' | 'participante'

export default function App() {
  const auth = useAuth()
  const [toast, setToast]       = useState<{ mensaje: string; tipo: 'ok' | 'error' } | null>(null)
  const [modalRango, setModalRango] = useState(false)
  const [modalConfig, setModalConfig] = useState(false)
  const [config, setConfig]     = useState<UserConfig | null>(null)
  const [vista, setVista] = useState<Vista>('participante')
  const [tabParticipante, setTabParticipante] = useState<'agendar' | 'mis-reservas'>('agendar')
  const [modalDatos, setModalDatos] = useState(false)

  const mostrarToast = (mensaje: string, tipo: 'ok' | 'error' = 'ok') => {
    setToast({ mensaje, tipo })
  }

  const abrirConfig = async () => {
    try {
      const data = await userConfigService.getMe()
      setConfig(data)
    } catch {
      setConfig(null)
    }
    setModalConfig(true)
  }

  if (auth.loading) return null

  const renderPage = () => {
    if (!auth.user) return <HomePage auth={auth} />

    switch(auth.user.rol) {
      case 2:
      case 3: return vista === 'participante'
        ? <ParticipantePage auth={auth} mostrarToast={mostrarToast} onVolver={() => setVista('supervisor')} tab={tabParticipante} onTabChange={setTabParticipante} />
        : <SupervisorPage auth={auth} mostrarToast={mostrarToast} modalRango={modalRango} onCerrarRango={() => setModalRango(false)} />
      case 1:
        return <ParticipantePage auth={auth} mostrarToast={mostrarToast} />
      default:
        return <HomePage auth={auth} />
    }
  }

  return (
  <>
    <Header
      vista={vista}
      auth={auth}
      onCrearRango={() => setModalRango(true)}
      onUserConfig={abrirConfig}
      onVistaSuper={() => setVista('supervisor')}
      onMisReservas={() => { setTabParticipante('agendar'); setVista('participante') }}
      onMisDatos={() => setModalDatos(true)}
    />
    {renderPage()}
    <ModalUserConfig
      open={modalConfig}
      config={config}
      onClose={() => setModalConfig(false)}
      onConfirm={async (data) => {
        try {
          await userConfigService.actualizar(data)
          setModalConfig(false)
          mostrarToast('Configuración guardada')
        } catch {
          mostrarToast('Error al guardar', 'error')
        }
      }}
    />
    <ModalMisDatos
      open={modalDatos}
      onClose={() => setModalDatos(false)}
      onConfirm={async (data) => {
        try {
          await usersService.actualizarPerfil(data)
          setModalDatos(false)
          mostrarToast('Datos guardados')
        } catch {
          mostrarToast('Error al guardar', 'error')
        }
      }}
    />
    {toast && <Toast mensaje={toast.mensaje} tipo={toast.tipo} onClose={() => setToast(null)} />}
  </>
  )
}