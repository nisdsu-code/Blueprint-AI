import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { fetchCurrentUser, registerAccount, signIn } from '../services/authService.js'
import { tokenStorage } from '../services/apiClient.js'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(() => Boolean(tokenStorage.get()))

  useEffect(() => {
    if (!tokenStorage.get()) return

    let isCancelled = false

    fetchCurrentUser()
      .then((currentUser) => {
        if (!isCancelled) setUser(currentUser)
      })
      .catch(() => {
        tokenStorage.clear()
      })
      .finally(() => {
        if (!isCancelled) setIsLoading(false)
      })

    return () => {
      isCancelled = true
    }
  }, [])

  const saveSession = useCallback((data) => {
    tokenStorage.set(data.token)
    setUser(data.user)
    return data.user
  }, [])

  const login = useCallback(
    async (credentials) => saveSession(await signIn(credentials)),
    [saveSession],
  )

  const register = useCallback(
    async (details) => saveSession(await registerAccount(details)),
    [saveSession],
  )

  const logout = useCallback(() => {
    tokenStorage.clear()
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, isLoading, isAuthenticated: Boolean(user), login, register, logout }),
    [user, isLoading, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
