import { useState, type FormEvent } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuth } from '../contexts/AuthContext'
import { loginUser } from '../services/auth'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const token = await loginUser(email, password)
      login(token)
      navigate('/')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-xl">
        {/* Logo / Header */}
        <div className="text-center mb-10">
          <img src="/Logo.png" alt="Grão & Byte" className="h-50 w-auto mx-auto -mb-10" />
          <h1 className="text-5xl font-bold text-primary">Grão & Byte</h1>
          <p className="text-muted-foreground mt-2 text-lg">Sistema de gestão de produtos</p>
        </div>

        <Card className="shadow-md">
          <CardHeader className="pb-6 px-10 pt-8">
            <CardTitle className="text-3xl">Login</CardTitle>
            <CardDescription className="text-base mt-1">Use suas credenciais de funcionário para entrar no sistema</CardDescription>
          </CardHeader>
          <CardContent className="px-10 pb-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xl font-medium text-foreground" htmlFor="email">
                  E-mail
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="funcionario@graobyte.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="h-12 text-base"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xl font-medium text-foreground" htmlFor="password">
                  Senha
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="h-12 text-base pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full mt-2 h-12 text-lg transition-transform hover:scale-[1.02] hover:shadow-md" disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
