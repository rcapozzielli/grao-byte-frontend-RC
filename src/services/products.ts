import { apiGet, apiPost, apiPut, apiDelete } from './api'

export interface Product {
  _id: string
  name: string
  description: string
  price: number
  category: string
  available: boolean
  createdAt: string
  updatedAt: string
}

export type ProductInput = Omit<Product, '_id' | 'createdAt' | 'updatedAt'>

export async function getProducts(): Promise<Product[]> {
  return apiGet<Product[]>('/api/products', false)
}

export async function createProduct(data: ProductInput): Promise<Product> {
  return apiPost<Product>('/api/products', data, true)
}

export async function updateProduct(id: string, data: Partial<ProductInput>): Promise<Product> {
  return apiPut<Product>(`/api/products/${id}`, data)
}

export async function deleteProduct(id: string): Promise<void> {
  return apiDelete(`/api/products/${id}`)
}
