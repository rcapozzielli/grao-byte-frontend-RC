import { apiPost } from './api'

interface LoginResponse {
  token: string
  user: {
    _id: string
    name: string
    email: string
    role: 'admin' | 'employee'
  }
}

export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  return apiPost<LoginResponse>('/api/auth/login', { email, password })
}
