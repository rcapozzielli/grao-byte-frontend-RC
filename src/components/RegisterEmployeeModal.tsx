import { useState } from 'react'
import { toast } from 'sonner'
import { Eye, EyeOff } from 'lucide-react'
import { apiPost } from '../services/api'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

interface Props {
  open: boolean
  onClose: () => void
}

interface RegisterForm {
  name: string
  email: string
  password: string
  role: 'admin' | 'employee'
}

const EMPTY: RegisterForm = { name: '', email: '', password: '', role: 'employee' }

export default function RegisterEmployeeModal({ open, onClose }: Props) {
  const [form, setForm] = useState<RegisterForm>(EMPTY)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  function set<K extends keyof RegisterForm>(key: K, value: RegisterForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: '' }))
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {}
    if (!form.name.trim()) newErrors.name = 'O nome é obrigatório.'
    if (!form.email.trim()) newErrors.email = 'O e-mail é obrigatório.'
    if (!form.password.trim()) newErrors.password = 'A senha é obrigatória.'
    if (form.password.length > 0 && form.password.length < 6) newErrors.password = 'A senha deve ter pelo menos 6 caracteres.'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await apiPost('/api/auth/register', form, true)
      toast.success(`Funcionário "${form.name}" cadastrado com sucesso!`)
      setForm(EMPTY)
      onClose()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao cadastrar funcionário')
    } finally {
      setLoading(false)
    }
  }

  function handleClose() {
    setForm(EMPTY)
    setErrors({})
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-2xl p-8">
        <DialogHeader>
          <DialogTitle className="text-3xl">Registrar funcionário</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-2">
          {/* Nome */}
          <div className="space-y-2">
            <label className="text-lg font-medium" htmlFor="rname">Nome *</label>
            <Input
              id="rname"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="Ex: Lucas Ferreira"
              className={`h-12 text-lg ${errors.name ? 'border-destructive' : ''}`}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-lg font-medium" htmlFor="remail">E-mail *</label>
            <Input
              id="remail"
              type="email"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              placeholder="funcionario@graobyte.com"
              className={`h-12 text-lg ${errors.email ? 'border-destructive' : ''}`}
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
          </div>

          {/* Senha */}
          <div className="space-y-2">
            <label className="text-lg font-medium" htmlFor="rpassword">Senha *</label>
            <div className="relative">
              <Input
                id="rpassword"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => set('password', e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className={`h-12 text-lg pr-12 ${errors.password ? 'border-destructive' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
          </div>

          {/* Role */}
          <div className="space-y-2">
            <label className="text-lg font-medium">Cargo *</label>
            <Select value={form.role} onValueChange={(v) => set('role', v as 'admin' | 'employee')}>
              <SelectTrigger className="h-12 text-lg w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="employee" className="text-lg">Funcionário</SelectItem>
                <SelectItem value="admin" className="text-lg">Administrador</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="pt-3">
            <Button type="button" variant="outline" size="lg" onClick={handleClose} disabled={loading} className="text-lg">
              Cancelar
            </Button>
            <Button type="submit" size="lg" disabled={loading} className="text-lg hover:scale-[1.02] transition-transform">
              {loading ? 'Cadastrando...' : 'Cadastrar funcionário'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
