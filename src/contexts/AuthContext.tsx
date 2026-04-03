import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

interface AuthUser {
  token: string
  name: string
  role: 'admin' | 'employee'
}

interface AuthContextType {
  token: string | null
  name: string | null
  role: 'admin' | 'employee' | null
  login: (token: string, name: string, role: 'admin' | 'employee') => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

function loadUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem('gb_user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(loadUser)

  useEffect(() => {
    if (user) {
      localStorage.setItem('gb_user', JSON.stringify(user))
      localStorage.setItem('gb_token', user.token)
    } else {
      localStorage.removeItem('gb_user')
      localStorage.removeItem('gb_token')
    }
  }, [user])

  function login(token: string, name: string, role: 'admin' | 'employee') {
    setUser({ token, name, role })
  }

  function logout() {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{
      token: user?.token ?? null,
      name: user?.name ?? null,
      role: user?.role ?? null,
      login,
      logout,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
