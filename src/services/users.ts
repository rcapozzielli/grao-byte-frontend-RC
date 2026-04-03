import { apiGet, apiDelete } from './api'

export interface User {
  _id: string
  name: string
  email: string
  role: 'admin' | 'employee'
}

export async function getUsers(): Promise<User[]> {
  return apiGet<User[]>('/api/users')
}

export async function deleteUser(id: string): Promise<void> {
  return apiDelete(`/api/users/${id}`)
}
