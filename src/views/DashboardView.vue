<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, TrendingUp, Users, Activity, Database, Calendar, Zap, Shield, Building2 } from 'lucide-vue-next'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// Computed properties
const user = computed(() => authStore.user)

// Statistics data
const stats = [
  {
    title: 'Total de Registros',
    value: '600K+',
    description: 'Datos históricos 1998-2018',
    icon: Database,
    bgColor: 'bg-slate-700',
    color: 'text-white',
    borderColor: 'border-slate-200',
    accentColor: 'text-slate-600',
  },
  {
    title: 'Estados',
    value: '6',
    description: 'AEP, DAYTON, DOM, DUQ, PJME, PJMW',
    icon: Users,
    bgColor: 'bg-slate-600',
    color: 'text-white',
    borderColor: 'border-slate-200',
    accentColor: 'text-slate-500',
  },
  {
    title: 'Años de Datos',
    value: '21',
    description: 'Cobertura temporal completa',
    icon: Calendar,
    bgColor: 'bg-slate-800',
    color: 'text-white',
    borderColor: 'border-slate-200',
    accentColor: 'text-slate-700',
  },
  {
    title: 'Calidad de Datos',
    value: '97.7%',
    description: 'Valores válidos',
    icon: Shield,
    bgColor: 'bg-slate-900',
    color: 'text-white',
    borderColor: 'border-slate-200',
    accentColor: 'text-slate-800',
  },
]

const quickActions = [
  {
    title: 'Análisis Exploratorio',
    description: 'Explorar datos históricos y tendencias del consumo energético',
    icon: BarChart3,
    href: '/exploratory-analysis',
    color: 'bg-slate-50 hover:bg-slate-100 border-slate-200',
    buttonColor: 'bg-slate-700 hover:bg-slate-800',
  },
  {
    title: 'Predicciones',
    description: 'Generar predicciones de consumo energético futuro',
    icon: TrendingUp,
    href: '/visualizations',
    color: 'bg-slate-50 hover:bg-slate-100 border-slate-200',
    buttonColor: 'bg-slate-700 hover:bg-slate-800',
  },

]

const navigateTo = (href: string) => {
  router.push(href)
}
</script>

<template>
  <AuthenticatedLayout
    page-title="Dashboard"
    page-description="Sistema de Predicción de Consumo Energético - UNMSM"
  >
    <div v-if="user" class="flex flex-col gap-8">
      <!-- Welcome Section with UNMSM Logo -->
      <div class="relative overflow-hidden bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 rounded-xl p-8 text-white shadow-xl border border-slate-600">
        <div class="absolute inset-0 bg-black/20"></div>
        <div class="relative z-10 flex items-center justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-6 mb-6">
              <div class="relative">
                <img src="@/assets/unmsm.png" alt="UNMSM Logo" class="w-20 h-20 object-contain bg-white rounded-xl p-3 shadow-lg border-2 border-slate-200" />
                <div class="absolute -bottom-1 -right-1 w-6 h-6 bg-slate-700 rounded-full border-2 border-white flex items-center justify-center">
                  <Building2 class="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <h1 class="text-3xl font-bold mb-2 text-slate-100">Bienvenido, {{ user.username }}</h1>
                <p class="text-xl text-slate-200 font-medium">
                  Sistema de Predicción de Consumo Energético
                </p>
                <p class="text-sm text-slate-300 mt-1 font-medium">
                  Universidad Nacional Mayor de San Marcos
                </p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div class="w-2 h-2 bg-slate-400 rounded-full"></div>
              <p class="text-slate-300 text-sm">
                Último acceso: {{ new Date(user.created_at).toLocaleString('es-PE') }}
              </p>
            </div>
          </div>
          <div class="hidden lg:block">
            <div class="text-right">
              <div class="text-6xl font-bold text-slate-600/30">UNMSM</div>
              <div class="text-sm text-slate-400 mt-2 font-medium">Investigación & Desarrollo</div>
              <div class="text-xs text-slate-500 mt-1">Sistema de Predicción</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card 
          v-for="(stat, index) in stats" 
          :key="index"
          class="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 bg-white"
          :class="stat.borderColor"
        >
          <CardHeader class="flex flex-row items-center justify-between gap-0 pb-4">
            <CardTitle class="text-sm font-semibold text-slate-600">
              {{ stat.title }}
            </CardTitle>
            <div :class="`p-3 ${stat.bgColor} rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300`">
              <component :is="stat.icon" class="w-5 h-5" :class="stat.color" />
            </div>
          </CardHeader>
          <CardContent>
            <div class="text-3xl font-bold text-slate-800 mb-2">{{ stat.value }}</div>
            <p class="text-xs text-slate-500 leading-relaxed">{{ stat.description }}</p>
          </CardContent>
        </Card>
      </div>

      <!-- Quick Actions -->
      <div>
        <h2 class="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
          <Zap class="w-6 h-6 text-slate-600" />
          Acciones Rápidas
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card
            v-for="(action, index) in quickActions"
            :key="index"
            :class="`cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-2 ${action.color}`"
            @click="navigateTo(action.href)"
          >
            <CardHeader class="pb-4">
              <div class="flex items-center gap-4 mb-3">
                <div class="p-3 bg-slate-100 rounded-xl shadow-sm border border-slate-200">
                  <component :is="action.icon" class="h-6 w-6 text-slate-700" />
                </div>
                <CardTitle class="text-lg font-semibold text-slate-800">{{ action.title }}</CardTitle>
              </div>
              <CardDescription class="text-sm leading-relaxed text-slate-600">{{ action.description }}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                :class="`w-full ${action.buttonColor} text-white font-medium py-3`"
                variant="default"
              >
                Acceder
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <!-- System Info Section -->
      <Card class="bg-gradient-to-r from-slate-50 to-slate-100 border-2 border-slate-200">
        <CardHeader>
          <CardTitle class="text-xl font-bold text-slate-800 flex items-center gap-3">
            <Shield class="w-5 h-5 text-slate-600" />
            Información del Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="font-semibold text-slate-700 mb-3 text-lg">Características Principales</h3>
              <ul class="text-sm text-slate-600 flex flex-col gap-2">
                <li class="flex items-start gap-2">
                  <div class="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Análisis de datos históricos de consumo energético</span>
                </li>
                <li class="flex items-start gap-2">
                  <div class="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Predicciones basadas en machine learning</span>
                </li>
                <li class="flex items-start gap-2">
                  <div class="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Predicciones interactivas</span>
                </li>
                <li class="flex items-start gap-2">
                  <div class="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Interfaz intuitiva y responsive</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 class="font-semibold text-slate-700 mb-3 text-lg">Tecnologías Utilizadas</h3>
              <ul class="text-sm text-slate-600 flex flex-col gap-2">
                <li class="flex items-start gap-2">
                  <div class="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Vue.js 3 con Composition API</span>
                </li>
                <li class="flex items-start gap-2">
                  <div class="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>TypeScript para type safety</span>
                </li>
                <li class="flex items-start gap-2">
                  <div class="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Tailwind CSS para estilos</span>
                </li>
                <li class="flex items-start gap-2">
                  <div class="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Algoritmos de predicción avanzados</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Footer Section -->
      <div class="text-center py-6 border-t border-slate-200">
        <p class="text-sm text-slate-500">
          © 2024 Universidad Nacional Mayor de San Marcos. Sistema de Predicción de Consumo Energético.
        </p>
      </div>
    </div>
  </AuthenticatedLayout>
</template>

<style scoped>
/* Custom animations and styles */
.card-hover {
  transition: all 0.3s ease;
}

.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Professional gradient text effect */
.gradient-text {
  background: linear-gradient(135deg, #475569 0%, #1e293b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Subtle border animation */
.border-animate {
  position: relative;
}

.border-animate::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 2px solid transparent;
  border-radius: inherit;
  background: linear-gradient(45deg, #64748b, #475569) border-box;
  -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: destination-out;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.border-animate:hover::before {
  opacity: 1;
}
</style>
