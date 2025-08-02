<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center p-4"
  >
    <div class="w-full max-w-lg">
      <!-- Header with UNMSM Logo -->
      <div class="flex flex-col items-center mb-8">
        <img 
          src="@/assets/unmsm.png" 
          alt="UNMSM Logo" 
          class="w-72 object-contain mb-6"
        />
        <div class="flex flex-col items-center">
          <h1 class="text-3xl font-bold text-gray-900 bg-gradient-to-r from-unmsm-slate to-unmsm-navy bg-clip-text">
            Sistema de Predicción
          </h1>
          <p class="text-xl font-semibold text-gray-900">Consumo Energético</p>
          <p class="text-gray-900 text-sm font-medium">Universidad Nacional Mayor de San Marcos</p>
        </div>
      </div>

      <!-- Login Card -->
      <div class="bg-white rounded-2xl shadow-xl p-8 border border-slate-200 backdrop-blur-sm">
        <div class="flex flex-col items-center mb-8">
          <h2 class="text-2xl font-bold text-gray-900">Iniciar Sesión</h2>F
          <p class="text-sm text-gray-900">Ingrese sus credenciales para continuar</p>
        </div>

        <form @submit.prevent="handleLogin" class="flex flex-col gap-6">
          <div class="flex flex-col gap-2">
            <Label for="username" class="text-sm font-semibold text-gray-900">Usuario</Label>
            <Input
              id="username"
              type="text"
              placeholder="Ingrese su usuario"
              v-model="credentials.username"
              :disabled="isLoading"
              required
              class="w-full h-12 px-4 border-2 border-slate-200 focus:border-unmsm-slate focus:ring-2 focus:ring-unmsm-slate/20 rounded-xl transition-all duration-200"
            />
          </div>

          <div class="flex flex-col gap-2">
            <Label for="password" class="text-sm font-semibold text-gray-900">Contraseña</Label>
            <div class="relative flex items-center">
              <Input
                id="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Ingrese su contraseña"
                v-model="credentials.password"
                :disabled="isLoading"
                required
                class="w-full h-12 px-4 pr-12 border-2 border-slate-200 focus:border-unmsm-slate focus:ring-2 focus:ring-unmsm-slate/20 rounded-xl transition-all duration-200"
              />
              <Button
                type="button"
                size="icon"
                @click="togglePassword"
                :disabled="isLoading"
              >
                <Eye v-if="!showPassword" class="h-4 w-4" />
                <EyeOff v-else class="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div v-if="error" class="flex items-center gap-3 bg-red-50 border-2 border-red-200 rounded-xl p-4">
            <AlertTriangle class="h-5 w-5 text-red-600 flex-shrink-0" />
            <span class="text-sm text-red-800 font-medium">{{ error }}</span>
          </div>

          <Button 
            type="submit" 
            :disabled="isLoading" 
            size="lg"
          >
            <span v-if="isLoading" class="flex items-center gap-2">
              <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Autenticando...
            </span>
            <span v-else>Iniciar Sesión</span>
          </Button>
        </form>

        <div class="flex justify-center mt-8 pt-6 border-t border-slate-200">
          <p class="text-sm text-gray-900">
            ¿No tiene una cuenta?
            <router-link 
              to="/register" 
              class="text-unmsm-slate hover:text-unmsm-navy font-semibold transition-colors duration-200 hover:underline"
            >
              Registrarse
            </router-link>
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex justify-center mt-8">
        <p class="text-xs text-gray-900">
          © 2024 Universidad Nacional Mayor de San Marcos. Todos los derechos reservados.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Eye, EyeOff, AlertTriangle } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// Reactive state
const showPassword = ref(false)
const credentials = reactive({
  username: '',
  password: '',
})

// Computed properties
const isLoading = computed(() => authStore.isLoading)
const error = computed(() => authStore.error)

// Methods
const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const handleLogin = async () => {
  const success = await authStore.login(credentials)
  
  if (success) {
    // Check if there's a redirect query parameter
    const redirectPath = route.query.redirect as string
    router.push(redirectPath || '/dashboard')
  }
}

// Clear error when component mounts
onMounted(() => {
  authStore.clearError()
})
</script>

<style scoped>
/* Additional custom styles if needed */
</style>
