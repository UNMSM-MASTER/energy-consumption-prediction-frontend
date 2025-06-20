<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4"
  >
    <div class="w-full max-w-md">
      <!-- Header -->
      <div class="text-center mb-8">
        <!-- <div class="bg-white rounded-lg p-4 shadow-sm mb-4 inline-block">
          <div class="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <span class="text-white text-xl font-bold">O</span>
          </div>
        </div> -->
        <p class="text-gray-600 text-2xl">Sistema de Predicción de Consumo Energético</p>
      </div>

      <div class="bg-white rounded-lg shadow-lg p-6">
        <div class="space-y-1 mb-6">
          <h2 class="text-2xl font-semibold text-center">Iniciar Sesión</h2>
          <p class="text-sm text-gray-600 text-center">Ingrese sus credenciales institucionales</p>
        </div>

        <form @submit.prevent="handleLogin" class="flex flex-col gap-4">
          <div class="space-y-2">
            <Label for="username" class="text-sm font-medium text-gray-700">Usuario</Label>
            <Input
              id="username"
              type="text"
              placeholder="usuario@unmsm.edu.pe"
              v-model="credentials.username"
              :disabled="isBlocked || isLoading"
              required
              class="w-full"
            />
          </div>

          <div class="space-y-2">
            <Label for="password" class="text-sm font-medium text-gray-700">Contraseña</Label>
            <div class="relative">
              <Input
                id="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                v-model="credentials.password"
                :disabled="isBlocked || isLoading"
                required
                class="w-full pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                @click="togglePassword"
                :disabled="isBlocked || isLoading"
                class="absolute right-0 top-0 h-full px-3 py-2 text-gray-400 hover:text-gray-600"
              >
                <Eye v-if="!showPassword" class="h-4 w-4" />
                <EyeOff v-else class="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-3">
            <div class="flex items-center gap-2">
              <AlertTriangle class="h-4 w-4 text-red-500" />
              <span class="text-sm text-red-700">{{ error }}</span>
            </div>
          </div>

          <Button type="submit" :disabled="isBlocked || isLoading" class="w-full mt-4" size="lg">
            {{ isLoading ? 'Autenticando...' : 'Iniciar Sesión' }}
          </Button>
        </form>
      </div>

      <div class="text-center mt-6 text-xs text-gray-500">
        <p>Demo: usuario: admin, contraseña: admin123</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Eye, EyeOff, Shield, AlertTriangle } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const router = useRouter()

// Reactive state
const showPassword = ref(false)
const credentials = reactive({
  username: '',
  password: '',
})
const attempts = ref(0)
const isBlocked = ref(false)
const isLoading = ref(false)
const error = ref('')

// Methods
const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const handleLogin = async () => {
  if (isBlocked.value) {
    error.value = 'Cuenta bloqueada por múltiples intentos fallidos. Contacte al administrador.'
    return
  }

  isLoading.value = true
  error.value = ''

  // Simulate authentication with Active Directory
  setTimeout(() => {
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      // Successful login
      localStorage.setItem('auth_token', 'mock_token_' + Date.now())
      localStorage.setItem(
        'user_data',
        JSON.stringify({
          username: credentials.username,
          role: 'Analista de Datos',
          lastLogin: new Date().toISOString(),
        }),
      )
      router.push('/dashboard')
    } else {
      // Failed login
      const newAttempts = attempts.value + 1
      attempts.value = newAttempts

      if (newAttempts >= 5) {
        isBlocked.value = true
        error.value = 'Cuenta bloqueada por exceder el límite de intentos (5 máximo)'
      } else {
        error.value = `Credenciales incorrectas. Intentos restantes: ${5 - newAttempts}`
      }
    }
    isLoading.value = false
  }, 1500)
}
</script>

<style scoped>
/* Additional custom styles if needed */
</style>
