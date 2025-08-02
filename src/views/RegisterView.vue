<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4"
  >
    <div class="w-full max-w-md">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="bg-white rounded-lg p-4 shadow-sm mb-4 inline-block">
          <div class="w-12 h-12 bg-unmsm-slate rounded-lg flex items-center justify-center shadow-md">
            <span class="text-white text-xl font-bold">U</span>
          </div>
        </div>
        <p class="text-slate-600 text-2xl font-medium">Sistema de Predicción de Consumo Energético</p>
        <p class="text-slate-500 text-sm mt-2">Universidad Nacional Mayor de San Marcos</p>
      </div>

      <div class="bg-white rounded-lg shadow-lg p-6 border border-slate-200">
        <div class="flex flex-col gap-1 mb-6">
          <h2 class="text-2xl font-semibold text-center text-slate-800">Registro de Usuario</h2>
          <p class="text-sm text-slate-600 text-center">Cree su cuenta para acceder al sistema</p>
        </div>

        <form @submit.prevent="handleRegister" class="flex flex-col gap-4">
          <div class="flex flex-col gap-2">
            <Label for="username" class="text-sm font-medium text-slate-700">Usuario</Label>
            <Input
              id="username"
              type="text"
              placeholder="usuario"
              v-model="formData.username"
              :disabled="isLoading"
              required
              class="w-full border-slate-300 focus:border-unmsm-slate focus:ring-unmsm-slate"
            />
          </div>

          <div class="flex flex-col gap-2">
            <Label for="email" class="text-sm font-medium text-slate-700">Correo Electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="usuario@unmsm.edu.pe"
              v-model="formData.email"
              :disabled="isLoading"
              required
              class="w-full border-slate-300 focus:border-unmsm-slate focus:ring-unmsm-slate"
            />
          </div>

          <div class="flex flex-col gap-2">
            <Label for="fullName" class="text-sm font-medium text-slate-700">Nombre Completo</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Nombre Apellido"
              v-model="formData.full_name"
              :disabled="isLoading"
              class="w-full border-slate-300 focus:border-unmsm-slate focus:ring-unmsm-slate"
            />
          </div>

          <div class="flex flex-col gap-2">
            <Label for="password" class="text-sm font-medium text-slate-700">Contraseña</Label>
            <div class="relative">
              <Input
                id="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                v-model="formData.password"
                :disabled="isLoading"
                required
                class="w-full pr-10 border-slate-300 focus:border-unmsm-slate focus:ring-unmsm-slate"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                @click="togglePassword"
                :disabled="isLoading"
                class="absolute right-0 top-0 h-full px-3 py-2 text-slate-400 hover:text-slate-600"
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

          <Button 
            type="submit" 
            :disabled="isLoading" 
            class="w-full mt-4 bg-unmsm-slate hover:bg-unmsm-navy text-white" 
            size="lg"
          >
            {{ isLoading ? 'Registrando...' : 'Registrarse' }}
          </Button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-sm text-slate-600">
            ¿Ya tiene una cuenta?
            <router-link to="/login" class="text-unmsm-slate hover:text-unmsm-navy font-medium">
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
