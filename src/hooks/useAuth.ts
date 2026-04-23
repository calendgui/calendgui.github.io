import { useState, useEffect } from 'react'
import { authService } from '../services/auth.service'
import { usersService } from '../services/user.service.ts'
import type { AppUser } from '../services/user.service.ts'

export function useAuth() {
  const [user, setUser] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    return authService.onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        const me = await usersService.getMe()
        setUser(me)
      } else {
        setUser(null)
      }
      setLoading(false)
    })
  }, [])

  const login = async () => {
    await authService.login()
    // onAuthChange se dispara solo
  }

  const logout = async () => {
    await authService.logout()
  }

  return { user, loading, login, logout }
}