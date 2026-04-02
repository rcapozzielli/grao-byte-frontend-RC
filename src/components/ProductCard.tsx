import { useState } from 'react'
import type { Product } from '../services/products'
import { Button } from './ui/button'
import { Card, CardContent, CardFooter } from './ui/card'
import { Coffee, Croissant, Cookie, GlassWater, UtensilsCrossed, type LucideIcon } from 'lucide-react'

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  'Café':    Coffee,
  'Salgado': Croissant,
  'Doce':    Cookie,
  'Bebida':  GlassWater,
}

interface Props {
  product: Product
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
  onToggle: (product: Product) => Promise<void>
}

export default function ProductCard({ product, onEdit, onDelete, onToggle }: Props) {
  const price = product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  const Icon = CATEGORY_ICONS[product.category] ?? UtensilsCrossed
  const [toggling, setToggling] = useState(false)

  async function handleToggle() {
    setToggling(true)
    try {
      await onToggle(product)
    } finally {
      setToggling(false)
    }
  }

  return (
    <Card className="flex flex-col hover:shadow-md transition-shadow">
      <CardContent className="flex flex-col flex-1 pt-6 px-6 gap-3">
        {/* Nome + badge clicável */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-foreground text-2xl leading-tight line-clamp-2">{product.name}</h3>
          <button
            onClick={handleToggle}
            disabled={toggling}
            title={product.available ? 'Marcar como indisponível' : 'Marcar como disponível'}
            className={`text-sm px-2.5 py-1 rounded-full shrink-0 font-semibold cursor-pointer transition-opacity hover:opacity-70 disabled:opacity-50 ${
              product.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
            }`}
          >
            {product.available ? 'Disponível' : 'Indisponível'}
          </button>
        </div>

        {/* Descrição */}
        <p className="text-base text-muted-foreground line-clamp-3 flex-1">
          {product.description}
        </p>

        {/* Preço + ícone */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-2xl font-bold text-primary">{price}</span>
          <Icon className="w-10 h-10 text-primary/60" />
        </div>
      </CardContent>
      <CardFooter className="gap-3 pt-2 px-6 pb-4 justify-center border-t">
        <Button variant="outline" size="lg" className="flex-1 text-base" onClick={() => onEdit(product)}>
          Editar
        </Button>
        <Button variant="destructive" size="lg" className="flex-1 text-base" onClick={() => onDelete(product)}>
          Excluir
        </Button>
      </CardFooter>
    </Card>
  )
}
