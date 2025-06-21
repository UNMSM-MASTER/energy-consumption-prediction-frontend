<template>
  <AuthenticatedLayout>
    <div class="flex flex-col gap-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold">Análisis Exploratorio de Datos</h1>
          <p class="text-gray-600">Datos históricos de consumo energético 1998-2018</p>
        </div>
        <Button @click="goToVisualizations" variant="outline">
          <BarChart3 class="mr-2 h-4 w-4" />
          Ver Visualizaciones
        </Button>
      </div>

      <!-- Dataset Overview -->
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-medium text-gray-600">Total Registros</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">{{ datasetStats.totalRecords }}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-medium text-gray-600">Compañías</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">{{ datasetStats.states }}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-medium text-gray-600">Años</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">{{ datasetStats.years }}</div>
          </CardContent>
        </Card>
      </div>

      <!-- Analysis Controls -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Settings class="h-5 w-5" />
            Configuración de Análisis
          </CardTitle>
          <CardDescription>Configure los parámetros para el análisis exploratorio</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            <div class="flex flex-col gap-2">
              <Label for="year">Año</Label>
              <select id="year" v-model="selectedYear" class="w-full border rounded-md p-2">
                <option value="">Seleccionar año</option>
                <option v-for="year in years" :key="year" :value="year">
                  {{ year }}
                </option>
              </select>
            </div>
            <div class="flex flex-col gap-2">
              <Label for="month">Mes</Label>
              <select id="month" v-model="selectedMonth" class="w-full border rounded-md p-2">
                <option value="">Seleccionar mes</option>
                <option v-for="month in months" :key="month.value" :value="month.value">
                  {{ month.label }}
                </option>
              </select>
            </div>
            <div class="flex flex-col gap-2">
              <Label for="day">Día</Label>
              <select id="day" v-model="selectedDay" class="w-full border rounded-md p-2">
                <option value="">Seleccionar día</option>
                <option v-for="day in days" :key="day" :value="day">
                  {{ day }}
                </option>
              </select>
            </div>
            <div class="flex flex-col gap-2">
              <Label for="hour">Hora (24h)</Label>
              <select id="hour" v-model="selectedHour" class="w-full border rounded-md p-2">
                <option value="">Seleccionar hora</option>
                <option v-for="hour in hours" :key="hour" :value="hour">
                  {{ hour.toString().padStart(2, '0') }}:00
                </option>
              </select>
            </div>
            <div class="flex flex-col gap-2">
              <Label for="company">Compañía</Label>
              <select id="company" v-model="selectedCompany" class="w-full border rounded-md p-2">
                <option value="">Seleccionar compañía</option>
                <option v-for="company in companies" :key="company" :value="company">
                  {{ company }}
                </option>
              </select>
            </div>
          </div>
          <div class="flex justify-end">
            <Button @click="handleAnalysis" :disabled="isAnalyzing || !isFormValid" class="w-auto">
              <template v-if="isAnalyzing">
                <Loader2 class="mr-2 h-4 w-4 animate-spin" />
                Analizando...
              </template>
              <template v-else>
                <BarChart3 class="mr-2 h-4 w-4" />
                Iniciar Análisis
              </template>
            </Button>
          </div>
          <div
            v-if="formattedDateTime"
            class="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md"
          >
            <div class="text-sm text-blue-700">
              <strong>Fecha y hora seleccionada:</strong> {{ formattedDateTime }}
            </div>
          </div>
          <div v-if="isAnalyzing" class="flex flex-col gap-2">
            <div class="flex justify-between text-sm">
              <span>Progreso del análisis</span>
              <span>{{ analysisProgress }}%</span>
            </div>
            <!-- Simple progress bar, replace with shadcn-vue Progress when available -->
            <div class="w-full bg-gray-200 rounded-full h-2.5">
              <div
                class="bg-blue-600 h-2.5 rounded-full"
                :style="{ width: analysisProgress + '%' }"
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Analysis Results -->
      <div v-if="analysisComplete">
        <!-- Simple Tabs, replace with shadcn-vue Tabs when available -->
        <div class="mb-4">
          <div class="grid w-full grid-cols-4 border-b">
            <button
              v-for="tab in tabs"
              :key="tab.value"
              @click="activeTab = tab.value"
              :class="[
                'py-2 px-4 text-sm font-medium',
                activeTab === tab.value
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600',
              ]"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>
        <div v-if="activeTab === 'analysis'" class="space-y-4">
          <!-- Prediction Results -->
          <Card v-if="predictionData">
            <CardHeader>
              <CardTitle class="flex items-center gap-2">
                <BarChart3 class="h-5 w-5" />
                Resultados de Predicción
              </CardTitle>
              <CardDescription>
                Predicción de consumo energético para {{ predictionData.input_data.company }} el
                {{ new Date(predictionData.input_data.datetime).toLocaleString('es-ES') }}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- Main Prediction -->
                <div
                  class="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200"
                >
                  <div class="text-sm text-blue-600 font-medium mb-2">Predicción Principal</div>
                  <div class="text-3xl font-bold text-blue-900">
                    {{ predictionData.prediction.toFixed(0) }}
                  </div>
                  <div class="text-sm text-blue-700">GWh</div>
                </div>

                <!-- Input Data -->
                <div class="bg-gray-50 p-6 rounded-lg border">
                  <div class="text-sm text-gray-600 font-medium mb-2">Datos de Entrada</div>
                  <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                      <span class="text-gray-600">Compañía:</span>
                      <span class="font-medium">{{ predictionData.input_data.company }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Fecha:</span>
                      <span class="font-medium">{{
                        new Date(predictionData.input_data.datetime).toLocaleDateString('es-ES')
                      }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Hora:</span>
                      <span class="font-medium">{{
                        new Date(predictionData.input_data.datetime).toLocaleTimeString('es-ES', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      }}</span>
                    </div>
                  </div>
                </div>

                <!-- Features -->
                <div class="bg-gray-50 p-6 rounded-lg border">
                  <div class="text-sm text-gray-600 font-medium mb-2">Características</div>
                  <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                      <span class="text-gray-600">Hora:</span>
                      <span class="font-medium">{{ predictionData.parsed_features.hour }}:00</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Día de semana:</span>
                      <span class="font-medium">{{
                        formatDayOfWeek(predictionData.parsed_features.dayofweek)
                      }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Mes:</span>
                      <span class="font-medium">{{
                        months[predictionData.parsed_features.month - 1]?.label
                      }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Fin de semana:</span>
                      <span class="font-medium">{{
                        predictionData.parsed_features.is_weekend ? 'Sí' : 'No'
                      }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Hora pico:</span>
                      <span class="font-medium">{{
                        predictionData.parsed_features.is_peak ? 'Sí' : 'No'
                      }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Lag Values -->
              <div class="mt-6">
                <h4 class="text-lg font-semibold mb-4">Valores de Lag (Histórico)</h4>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div class="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <div class="text-sm text-orange-600 font-medium mb-1">
                      Lag 1 (Hora anterior)
                    </div>
                    <div class="text-xl font-bold text-orange-900">
                      {{ predictionData.parsed_features.lag_1.toFixed(0) }}
                    </div>
                    <div class="text-sm text-orange-700">GWh</div>
                  </div>
                  <div class="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <div class="text-sm text-orange-600 font-medium mb-1">
                      Lag 2 (2 horas antes)
                    </div>
                    <div class="text-xl font-bold text-orange-900">
                      {{ predictionData.parsed_features.lag_2.toFixed(0) }}
                    </div>
                    <div class="text-sm text-orange-700">GWh</div>
                  </div>
                  <div class="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <div class="text-sm text-orange-600 font-medium mb-1">
                      Lag 3 (3 horas antes)
                    </div>
                    <div class="text-xl font-bold text-orange-900">
                      {{ predictionData.parsed_features.lag_3.toFixed(0) }}
                    </div>
                    <div class="text-sm text-orange-700">GWh</div>
                  </div>
                </div>
              </div>

              <!-- Prediction Metadata -->
              <!-- <div class="mt-6">
                <h4 class="text-lg font-semibold mb-4">Metadatos de Predicción</h4>
                <div class="bg-gray-50 p-4 rounded-lg border">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div class="flex justify-between">
                      <span class="text-gray-600">Método de pronóstico:</span>
                      <span class="font-medium">{{
                        predictionData.prediction_meta.forecast_method
                      }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Pasos de predicción:</span>
                      <span class="font-medium">{{ predictionData.prediction_meta.steps }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Último lag real 1:</span>
                      <span class="font-medium">{{
                        predictionData.prediction_meta.last_real_lag_1
                      }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Último lag real 2:</span>
                      <span class="font-medium">{{
                        predictionData.prediction_meta.last_real_lag_2
                      }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Último lag real 3:</span>
                      <span class="font-medium">{{
                        predictionData.prediction_meta.last_real_lag_3
                      }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">ID de predicción:</span>
                      <span class="font-medium text-xs">{{ predictionData.prediction_id }}</span>
                    </div>
                  </div>
                </div>
              </div> -->
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </AuthenticatedLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { BarChart3, Settings, Loader2 } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { apiRequest } from '@/lib/api'

// Types
interface ParsedFeatures {
  hour: number
  dayofweek: number
  month: number
  year: number
  is_weekend: number
  is_peak: number
  lag_1: number
  lag_2: number
  lag_3: number
}

interface InputData {
  company: string
  datetime: string
}

interface PredictionMeta {
  steps: number
  last_real_lag_1: number
  last_real_lag_2: number
  last_real_lag_3: number
  forecast_method: string
}

interface PredictionData {
  created_at: string
  created_by: string
  input_data: InputData
  parsed_features: ParsedFeatures
  prediction: number
  prediction_id: string
  prediction_meta: PredictionMeta
}

const router = useRouter()
const authStore = useAuthStore()

const selectedYear = ref('')
const selectedMonth = ref('')
const selectedDay = ref('')
const selectedHour = ref('')
const selectedCompany = ref('')
const analysisProgress = ref(0)
const isAnalyzing = ref(false)
const analysisComplete = ref(false)
const activeTab = ref('analysis')
const tabs = [{ value: 'analysis', label: 'Análisis' }]
const predictionData = ref<PredictionData | null>(null)

// Data arrays for the form inputs
const years = Array.from({ length: 3 }, (_, i) => 2018 + i)
const months = [
  { value: 1, label: 'Enero' },
  { value: 2, label: 'Febrero' },
  { value: 3, label: 'Marzo' },
  { value: 4, label: 'Abril' },
  { value: 5, label: 'Mayo' },
  { value: 6, label: 'Junio' },
  { value: 7, label: 'Julio' },
  { value: 8, label: 'Agosto' },
  { value: 9, label: 'Septiembre' },
  { value: 10, label: 'Octubre' },
  { value: 11, label: 'Noviembre' },
  { value: 12, label: 'Diciembre' },
]
const days = Array.from({ length: 31 }, (_, i) => i + 1)
const hours = Array.from({ length: 24 }, (_, i) => i)
const companies = ['AEP', 'DAYTON', 'DOM', 'DUQ', 'PJME', 'PJMW']

// Computed property for form validation
const isFormValid = computed(() => {
  return (
    selectedYear.value &&
    selectedMonth.value &&
    selectedDay.value &&
    selectedHour.value !== '' &&
    selectedCompany.value
  )
})

// Computed property to format the final date
const formattedDateTime = computed(() => {
  if (
    !selectedYear.value ||
    !selectedMonth.value ||
    !selectedDay.value ||
    selectedHour.value === ''
  ) {
    return ''
  }

  const year = selectedYear.value
  const month = selectedMonth.value.toString().padStart(2, '0')
  const day = selectedDay.value.toString().padStart(2, '0')
  const hour = selectedHour.value.toString().padStart(2, '0')

  return `${year}-${month}-${day} ${hour}:00:00`
})

const datasetStats = {
  totalRecords: '> 600000',
  states: '6',
  years: '3',
  missingValues: '2.3%',
  dataQuality: '80%',
}

function goToVisualizations() {
  router.push('/visualizations')
}

function formatDayOfWeek(dayOfWeek: number) {
  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
  return days[dayOfWeek]
}

function handleAnalysis() {
  console.log('Selected values:', {
    dateTime: formattedDateTime.value,
    company: selectedCompany.value,
  })

  isAnalyzing.value = true
  analysisProgress.value = 0
  analysisComplete.value = false
  activeTab.value = 'analysis'

  // Make API call to prediction endpoint
  apiRequest('/prediction/predict', {
    method: 'POST',
    body: JSON.stringify({
      datetime: formattedDateTime.value,
      company: selectedCompany.value,
    }),
  })
    .then((response) => {
      if (response.error) {
        console.error('Prediction error:', response.error)
        throw new Error(response.error)
      }

      console.log('Prediction response:', response.data)
      predictionData.value = response.data
      analysisProgress.value = 100
      isAnalyzing.value = false
      analysisComplete.value = true
    })
    .catch((error) => {
      console.error('Error making prediction:', error)
      isAnalyzing.value = false
      // Handle error - you might want to show an error message to the user
    })
}

onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
  }
})
</script>

<style scoped>
/* Add any additional custom styles if needed */
</style>
