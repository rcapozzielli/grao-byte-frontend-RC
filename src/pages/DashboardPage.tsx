import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import type { Product, ProductInput } from '../services/products'
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/products'
import Navbar from '../components/Navbar'
import ProductCard from '../components/ProductCard'
import ProductFormModal from '../components/ProductFormModal'
import DeleteConfirmModal from '../components/DeleteConfirmModal'
import { Button } from '../components/ui/button'

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [formOpen, setFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null)

  const fetchProducts = useCallback(async () => {
    try {
      setError(null)
      const data = await getProducts()
      setProducts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar produtos')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  function openCreate() {
    setEditingProduct(null)
    setFormOpen(true)
  }

  function openEdit(product: Product) {
    setEditingProduct(product)
    setFormOpen(true)
  }

  function openDelete(product: Product) {
    setDeletingProduct(product)
    setDeleteOpen(true)
  }

  async function handleFormSubmit(data: ProductInput) {
    if (editingProduct) {
      const updated = await updateProduct(editingProduct._id, data)
      setProducts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)))
      toast.success('Produto atualizado!')
    } else {
      const created = await createProduct(data)
      setProducts((prev) => [...prev, created])
      toast.success('Produto adicionado!')
    }
  }

  async function handleDeleteConfirm() {
    if (!deletingProduct) return
    try {
      await deleteProduct(deletingProduct._id)
      setProducts((prev) => prev.filter((p) => p._id !== deletingProduct._id))
      toast.success('Produto removido.')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao remover produto')
    } finally {
      setDeleteOpen(false)
      setDeletingProduct(null)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-8 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Produtos</h2>
            <p className="text-base text-muted-foreground mt-1">
              {products.length} {products.length === 1 ? 'item' : 'itens'} no cardápio
            </p>
          </div>
          <Button onClick={openCreate} size="lg" className="text-xl px-8 py-6 transition-transform hover:scale-[1.02] hover:shadow-md">+ Adicionar produto</Button>
        </div>

        {/* States */}
        {loading && (
          <div className="flex items-center justify-center py-24 text-muted-foreground">
            Carregando produtos...
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <p className="text-destructive">{error}</p>
            <Button variant="outline" onClick={fetchProducts}>
              Tentar novamente
            </Button>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
            <span className="text-5xl">☕</span>
            <p className="text-muted-foreground">Nenhum produto cadastrado ainda.</p>
            <Button onClick={openCreate}>Adicionar o primeiro produto</Button>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onEdit={openEdit}
                onDelete={openDelete}
              />
            ))}
          </div>
        )}
      </main>

      <ProductFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        product={editingProduct}
      />

      <DeleteConfirmModal
        open={deleteOpen}
        product={deletingProduct}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteOpen(false)
          setDeletingProduct(null)
        }}
      />
    </div>
  )
}
