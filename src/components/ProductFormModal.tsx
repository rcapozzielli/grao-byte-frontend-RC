import { useState, useEffect, type FormEvent } from 'react'
import type { Product, ProductInput } from '../services/products'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Switch } from './ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog'

const CATEGORIES = ['Café', 'Salgado', 'Doce', 'Bebida']

interface Props {
  open: boolean
  onClose: () => void
  onSubmit: (data: ProductInput) => Promise<void>
  product?: Product | null
}

const EMPTY: ProductInput = {
  name: '',
  description: '',
  price: 0,
  category: '',
  available: true,
}

export default function ProductFormModal({ open, onClose, onSubmit, product }: Props) {
  const [form, setForm] = useState<ProductInput>(EMPTY)
  const [priceInput, setPriceInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        available: product.available,
      })
      setPriceInput(String(product.price))
    } else {
      setForm(EMPTY)
      setPriceInput('')
    }
    setErrors({})
  }, [product, open])

  function set<K extends keyof ProductInput>(key: K, value: ProductInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: '' }))
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {}
    if (!form.name.trim()) newErrors.name = 'O nome do produto é obrigatório.'
    if (form.price < 0 || isNaN(form.price)) newErrors.price = 'Informe um preço válido (maior ou igual a zero).'
    if (!form.category) newErrors.category = 'Selecione uma categoria.'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await onSubmit(form)
      onClose()
    } finally {
      setLoading(false)
    }
  }

  const isEdit = !!product

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-2xl p-8">
        <DialogHeader>
          <DialogTitle className="text-3xl">{isEdit ? 'Editar produto' : 'Novo produto'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-2">
          {/* Nome */}
          <div className="space-y-2">
            <label className="text-lg font-medium" htmlFor="pname">Nome *</label>
            <Input
              id="pname"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="Ex: Cappuccino"
              className={`h-12 text-lg ${errors.name ? 'border-destructive focus-visible:ring-destructive' : ''}`}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <label className="text-lg font-medium" htmlFor="pdesc">Descrição</label>
            <Textarea
              id="pdesc"
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Ex: Espresso com leite vaporizado e espuma"
              rows={4}
              className="text-lg"
            />
          </div>

          {/* Preço e Categoria */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-lg font-medium" htmlFor="pprice">Preço (R$) *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-base font-medium select-none">
                  R$
                </span>
                <Input
                  id="pprice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={priceInput}
                  onChange={(e) => {
                    setPriceInput(e.target.value)
                    set('price', parseFloat(e.target.value) || 0)
                  }}
                  placeholder="0,00"
                  className={`h-12 text-lg pl-10 ${errors.price ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                />
              </div>
              {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-lg font-medium">Categoria *</label>
              <Select value={form.category} onValueChange={(v) => set('category', v)}>
                <SelectTrigger className={`h-12 text-lg w-full ${errors.category ? 'border-destructive' : ''}`}>
                  <SelectValue placeholder="Selecionar categoria" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat} className="text-lg">{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
            </div>
          </div>

          {/* Disponibilidade */}
          <div className="flex items-center gap-3">
            <Switch
              id="pavail"
              checked={form.available}
              onCheckedChange={(v) => set('available', v)}
              size="default"
            />
            <label htmlFor="pavail" className="text-lg font-medium cursor-pointer">
              {form.available ? 'Disponível no cardápio' : 'Indisponível no cardápio'}
            </label>
          </div>

          <DialogFooter className="pt-3">
            <Button type="button" variant="outline" size="lg" onClick={onClose} disabled={loading} className="text-lg">
              Cancelar
            </Button>
            <Button type="submit" size="lg" disabled={loading} className="text-base hover:brightness-110 transition-all active:scale-95">
              {loading ? 'Salvando...' : isEdit ? 'Salvar alterações' : 'Adicionar produto'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
