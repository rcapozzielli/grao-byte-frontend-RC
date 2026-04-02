import { useState, useEffect, useCallback, useMemo } from 'react'
import { toast } from 'sonner'
import type { Product, ProductInput } from '../services/products'
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/products'
import Navbar from '../components/Navbar'
import ProductCard from '../components/ProductCard'
import ProductFormModal from '../components/ProductFormModal'
import DeleteConfirmModal from '../components/DeleteConfirmModal'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'

const CATEGORY_ORDER = ['Café', 'Salgado', 'Doce', 'Bebida']

const CATEGORY_ICONS: Record<string, string> = {
  'Café': '☕',
  'Salgado': '🥐',
  'Doce': '🍰',
  'Bebida': '🥤',
}

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

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

  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map((p) => p.category)))
    return cats.sort((a, b) => {
      const ia = CATEGORY_ORDER.indexOf(a)
      const ib = CATEGORY_ORDER.indexOf(b)
      if (ia === -1 && ib === -1) return a.localeCompare(b)
      if (ia === -1) return 1
      if (ib === -1) return -1
      return ia - ib
    })
  }, [products])

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return products.filter((p) => {
      const matchesSearch = !query || p.name.toLowerCase().includes(query)
      const matchesCategory = !activeCategory || p.category === activeCategory
      return matchesSearch && matchesCategory
    })
  }, [products, search, activeCategory])

  const grouped = useMemo(() => {
    if (activeCategory) return [[activeCategory, filtered]] as [string, Product[]][]

    const map: Record<string, Product[]> = {}
    for (const p of filtered) {
      if (!map[p.category]) map[p.category] = []
      map[p.category].push(p)
    }
    return Object.entries(map).sort(([a], [b]) => {
      const ia = CATEGORY_ORDER.indexOf(a)
      const ib = CATEGORY_ORDER.indexOf(b)
      if (ia === -1 && ib === -1) return a.localeCompare(b)
      if (ia === -1) return 1
      if (ib === -1) return -1
      return ia - ib
    })
  }, [filtered, activeCategory])

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

      <main className="max-w-screen-2xl mx-auto px-8 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Produtos</h2>
            <p className="text-base text-muted-foreground mt-1">
              {products.length} {products.length === 1 ? 'item' : 'itens'} no cardápio
            </p>
          </div>
          <Button onClick={openCreate} size="lg" className="text-xl px-8 py-6 transition-transform hover:scale-[1.02] hover:shadow-md">
            + Adicionar produto
          </Button>
        </div>

        {!loading && !error && products.length > 0 && (
          <>
            {/* Category tabs */}
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={() => setActiveCategory(null)}
                className={`px-6 py-3 rounded-xl text-lg font-semibold border-2 transition-colors cursor-pointer ${
                  activeCategory === null
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card text-foreground border-border hover:border-primary/50'
                }`}
              >
                Todos
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
                  className={`px-6 py-3 rounded-xl text-lg font-semibold border-2 transition-colors cursor-pointer flex items-center gap-2 ${
                    activeCategory === cat
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-card text-foreground border-border hover:border-primary/50'
                  }`}
                >
                  <span>{CATEGORY_ICONS[cat] ?? '🍽️'}</span>
                  {cat}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="mb-8">
              <Input
                placeholder="Buscar produto por nome..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-12 text-base max-w-lg"
              />
            </div>
          </>
        )}

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

        {!loading && !error && products.length > 0 && grouped.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-2 text-center">
            <p className="text-muted-foreground text-lg">Nenhum produto encontrado para "{search}".</p>
          </div>
        )}

        {!loading && !error && grouped.length > 0 && (
          <div className="space-y-10">
            {grouped.map(([category, items]) => (
              <section key={category}>
                {!activeCategory && (
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{CATEGORY_ICONS[category] ?? '🍽️'}</span>
                    <h3 className="text-2xl font-semibold text-foreground">{category}</h3>
                    <span className="text-sm text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full">
                      {items.length} {items.length === 1 ? 'item' : 'itens'}
                    </span>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      onEdit={openEdit}
                      onDelete={openDelete}
                    />
                  ))}
                </div>
              </section>
            ))}
            {search && (
              <p className="text-sm text-muted-foreground">
                {filtered.length} {filtered.length === 1 ? 'resultado' : 'resultados'} para "{search}"
              </p>
            )}
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
