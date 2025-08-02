import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  apiRequest,
  type LoginCredentials,
  type RegisterData,
  type User,
  type AuthToken,
} from '@/lib/api'

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()

  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('auth_token'))
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value)

  // Actions
  const login = async (credentials: LoginCredentials) => {
    isLoading.value = true
    error.value = null

    console.log('Login attempt with credentials:', credentials)

    try {
      const response = await apiRequest<AuthToken>('/auth/token', {
        method: 'POST',
        body: JSON.stringify(credentials),
      })

      console.log('Login response:', response)

      if (response.error) {
        error.value = response.error
        return false
      }

      if (response.data) {
        token.value = response.data.access_token
        localStorage.setItem('auth_token', response.data.access_token)

        // Fetch user data
        await fetchUser()
        return true
      }

      return false
    } catch {
      error.value = 'Error de conexión. Intente nuevamente.'
      return false
    } finally {
      isLoading.value = false
    }
  }

  const register = async (userData: RegisterData) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiRequest<User>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      })

      if (response.error) {
        error.value = response.error
        return false
      }

      if (response.data) {
        // After successful registration, automatically login
        return await login({
          username: userData.username,
          password: userData.password,
        })
      }

      return false
    } catch {
      error.value = 'Error de conexión. Intente nuevamente.'
      return false
    } finally {
      isLoading.value = false
    }
  }

  const fetchUser = async () => {
    if (!token.value) return

    try {
      const response = await apiRequest<User>('/auth/users/me')

      if (response.error) {
        // If token is invalid, logout
        if (response.error.includes('token') || response.error.includes('unauthorized')) {
          logout()
        }
        return
      }

      if (response.data) {
        user.value = response.data
        localStorage.setItem('user_data', JSON.stringify(response.data))
      }
    } catch (err) {
      console.error('Error fetching user:', err)
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    error.value = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
    router.push('/login')
  }

  const clearError = () => {
    error.value = null
  }

  // Initialize user data from localStorage if token exists
  const initializeAuth = async () => {
    const storedUser = localStorage.getItem('user_data')
    if (token.value && storedUser) {
      try {
        user.value = JSON.parse(storedUser)
        // Verify token is still valid by fetching user data
        await fetchUser()
      } catch (err) {
        console.error('Error initializing auth:', err)
        logout()
      }
    }
  }

  return {
    // State
    user,
    token,
    isLoading,
    error,

    // Getters
    isAuthenticated,

    // Actions
    login,
    register,
    fetchUser,
    logout,
    clearError,
    initializeAuth,
  }
})
