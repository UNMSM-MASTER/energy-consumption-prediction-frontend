<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4"
  >
    <div class="w-full max-w-md">
      <!-- Header -->
      <div class="text-center mb-8">
        <p class="text-gray-600 text-2xl">Sistema de Predicción de Consumo Energético</p>
      </div>

      <div class="bg-white rounded-lg shadow-lg p-6">
        <div class="space-y-1 mb-6">
          <h2 class="text-2xl font-semibold text-center">Registro de Usuario</h2>
          <p class="text-sm text-gray-600 text-center">Cree su cuenta para acceder al sistema</p>
        </div>

        <form @submit.prevent="handleRegister" class="flex flex-col gap-4">
          <div class="space-y-2">
            <Label for="username" class="text-sm font-medium text-gray-700">Usuario</Label>
            <Input
              id="username"
              type="text"
              placeholder="usuario"
              v-model="formData.username"
              :disabled="isLoading"
              required
              class="w-full"
            />
          </div>

          <div class="space-y-2">
            <Label for="email" class="text-sm font-medium text-gray-700">Correo Electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="usuario@unmsm.edu.pe"
              v-model="formData.email"
              :disabled="isLoading"
              required
              class="w-full"
            />
          </div>

          <div class="space-y-2">
            <Label for="fullName" class="text-sm font-medium text-gray-700">Nombre Completo</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Nombre Apellido"
              v-model="formData.full_name"
              :disabled="isLoading"
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
                v-model="formData.password"
                :disabled="isLoading"
                required
                class="w-full pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                @click="togglePassword"
                :disabled="isLoading"
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

          <Button type="submit" :disabled="isLoading" class="w-full mt-4" size="lg">
            {{ isLoading ? 'Registrando...' : 'Registrarse' }}
          </Button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            ¿Ya tiene una cuenta?
            <router-link to="/login" class="text-blue-600 hover:text-blue-800 font-medium">
              Iniciar Sesión
            </router-link>
          </p>
        </div>
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
const formData = reactive({
  username: '',
  email: '',
  full_name: '',
  password: '',
})

// Computed properties
const isLoading = computed(() => authStore.isLoading)
const error = computed(() => authStore.error)

// Methods
const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const handleRegister = async () => {
  const success = await authStore.register(formData)

  if (success) {
    // Redirect to intended page or dashboard
    const redirectPath = (route.query.redirect as string) || '/dashboard'
    router.push(redirectPath)
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
