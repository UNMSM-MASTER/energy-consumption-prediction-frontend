// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

export interface ApiResponse<T = unknown> {
  data?: T
  message?: string
  error?: string
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface RegisterData {
  username: string
  email: string
  password: string
  full_name?: string
}

export interface User {
  id: number
  username: string
  email: string
  full_name?: string
  role?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AuthToken {
  access_token: string
  token_type: string
  expires_in?: number
}

// Common headers for API requests
export const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token')
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}

// API request helper
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> => {
  try {
    const url = `${API_BASE_URL}${endpoint}`

    // For login endpoint, send as form data instead of JSON
    if (endpoint === '/auth/token' && options.method === 'POST') {
      // Convert JSON body to FormData
      if (options.body) {
        const credentials = JSON.parse(options.body as string)
        const formData = new FormData()
        formData.append('username', credentials.username)
        formData.append('password', credentials.password)
        options.body = formData
      }

      // For FormData, don't set Content-Type header (browser will set it automatically)
      const token = localStorage.getItem('auth_token')
      const requestHeaders: Record<string, string> = {}
      if (token) {
        requestHeaders.Authorization = `Bearer ${token}`
      }

      console.log('API Request (FormData):', {
        url,
        method: options.method,
        headers: requestHeaders,
        body: options.body,
      })

      const response = await fetch(url, {
        ...options,
        headers: requestHeaders,
      })

      const data = await response.json()

      console.log('API Response:', {
        status: response.status,
        data,
      })

      if (!response.ok) {
        // Handle validation errors from FastAPI
        if (data.detail && Array.isArray(data.detail)) {
          const errorMessages = data.detail.map((err: { msg: string }) => err.msg).join(', ')
          throw new Error(errorMessages)
        }
        throw new Error(data.detail || data.message || 'Error en la solicitud')
      }

      return { data }
    } else {
      // For other endpoints, use JSON
      const baseHeaders = getAuthHeaders()
      const requestHeaders = {
        ...baseHeaders,
        ...options.headers,
      }

      console.log('API Request (JSON):', {
        url,
        method: options.method,
        headers: requestHeaders,
        body: options.body,
      })

      const response = await fetch(url, {
        ...options,
        headers: requestHeaders,
      })

      const data = await response.json()

      console.log('API Response:', {
        status: response.status,
        data,
      })

      if (!response.ok) {
        // Handle validation errors from FastAPI
        if (data.detail && Array.isArray(data.detail)) {
          const errorMessages = data.detail.map((err: { msg: string }) => err.msg).join(', ')
          throw new Error(errorMessages)
        }
        throw new Error(data.detail || data.message || 'Error en la solicitud')
      }

      return { data }
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Error desconocido',
    }
  }
}
