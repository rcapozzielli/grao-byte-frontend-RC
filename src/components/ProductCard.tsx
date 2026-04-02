import type { Product } from '../services/products'
import { Button } from './ui/button'
import { Card, CardContent, CardFooter } from './ui/card'

interface Props {
  product: Product
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
}

export default function ProductCard({ product, onEdit, onDelete }: Props) {
  const price = product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  return (
    <Card className="flex flex-col justify-between hover:shadow-md transition-shadow">
      <CardContent className="pt-6 px-6 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-foreground text-2xl leading-tight">{product.name}</h3>
          <span
            className={`text-xs px-2.5 py-1 rounded-full shrink-0 font-semibold ${
              product.available
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-600'
            }`}
          >
            {product.available ? 'Disponível' : 'Indisponível'}
          </span>
        </div>
        {product.description && (
          <p className="text-sm text-muted-foreground line-clamp-3">{product.description}</p>
        )}
        <div className="flex items-center justify-between pt-2">
          <span className="text-2xl font-bold text-primary">{price}</span>
          {product.category && (
            <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
              {product.category}
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter className="gap-3 pt-2 px-6 pb-2 justify-center">
        <Button variant="outline" size="lg" className="flex-1 text-base " onClick={() => onEdit(product)}>
          Editar
        </Button>
        <Button
          variant="destructive"
          size="lg"
          className="flex-1 text-base "
          onClick={() => onDelete(product)}
        >
          Excluir
        </Button>
      </CardFooter>
    </Card>
  )
}
