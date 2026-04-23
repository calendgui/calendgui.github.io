import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth'
import type { User } from 'firebase/auth'
import { auth } from '../config/firebase'

const provider = new GoogleAuthProvider()

export const authService = {
  login: () => signInWithPopup(auth, provider),
  logout: () => signOut(auth),
  onAuthChange: (cb: (user: User | null) => void) => onAuthStateChanged(auth, cb),
}