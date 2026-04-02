import { apiPost } from './api'

interface LoginResponse {
  token: string
}

export async function loginUser(email: string, password: string): Promise<string> {
  const data = await apiPost<LoginResponse>('/api/auth/login', { email, password })
  return data.token
}
