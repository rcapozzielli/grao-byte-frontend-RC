import { config } from '../config/config'

const BASE = config.apiBaseUrl

function getToken(): string | null {
  return localStorage.getItem('gb_token')
}

function buildHeaders(withAuth = false): HeadersInit {
  const headers: HeadersInit = { 'Content-Type': 'application/json' }
  if (withAuth) {
    const token = getToken()
    if (token) headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}

export async function apiGet<T>(path: string, withAuth = true): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: buildHeaders(withAuth),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || `Erro ${res.status}`)
  }
  return res.json()
}

export async function apiPost<T>(path: string, body: unknown, withAuth = false): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: buildHeaders(withAuth),
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || `Erro ${res.status}`)
  }
  return res.json()
}

export async function apiPut<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'PUT',
    headers: buildHeaders(true),
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || `Erro ${res.status}`)
  }
  return res.json()
}

export async function apiDelete(path: string): Promise<void> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'DELETE',
    headers: buildHeaders(true),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || `Erro ${res.status}`)
  }
}
