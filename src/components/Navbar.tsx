import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import RegisterEmployeeModal from './RegisterEmployeeModal'
import ManageUsersModal from './ManageUsersModal'

export default function Navbar() {
  const { logout, role } = useAuth()
  const navigate = useNavigate()
  const [registerOpen, setRegisterOpen] = useState(false)
  const [manageOpen, setManageOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <>
      <header className="bg-primary text-primary-foreground shadow-sm">
        <div className="px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src="/Logo Grao e Byte.png" alt="Grão & Byte" className="h-30 w-auto" />
            <span className="font-bold text-xl tracking-tight">Grão & Byte</span>
          </div>

          {/* Centro */}
          <span className="absolute left-1/2 -translate-x-1/2 text-2xl font-medium text-primary-foreground/80 hidden sm:block">
            Sistema de Gestão de Produtos
          </span>

          {/* Direita */}
          <div className="flex items-center gap-3">
            {role === 'admin' && (
              <>
                <button
                  onClick={() => setManageOpen(true)}
                  className="px-6 py-2.5 text-lg font-medium rounded-md border border-primary-foreground/50 text-primary-foreground bg-transparent hover:bg-primary-foreground/15 transition-colors cursor-pointer"
                >
                  Funcionários
                </button>
                <button
                  onClick={() => setRegisterOpen(true)}
                  className="px-6 py-2.5 text-lg font-medium rounded-md border border-primary-foreground/50 text-primary-foreground bg-transparent hover:bg-primary-foreground/15 transition-colors cursor-pointer"
                >
                  Registrar funcionário
                </button>
              </>
            )}
            <button
              onClick={handleLogout}
              className="px-6 py-2.5 text-lg font-medium rounded-md border border-primary-foreground/50 text-primary-foreground bg-transparent hover:bg-primary-foreground/15 transition-colors cursor-pointer"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <RegisterEmployeeModal open={registerOpen} onClose={() => setRegisterOpen(false)} />
      <ManageUsersModal open={manageOpen} onClose={() => setManageOpen(false)} />
    </>
  )
}
