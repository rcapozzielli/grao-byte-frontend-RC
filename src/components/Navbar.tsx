import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from './ui/button'

export default function Navbar() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <header className="bg-primary text-primary-foreground shadow-sm">
      <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">☕</span>
          <span className="font-bold text-xl tracking-tight">Grão & Byte</span>
        </div>
        <button
          onClick={handleLogout}
          className="px-6 py-2.5 text-lg font-medium rounded-md border border-primary-foreground/50 text-primary-foreground bg-transparent hover:bg-primary-foreground/15 transition-colors cursor-pointer"
        >
          Sair
        </button>
      </div>
    </header>
  )
}
