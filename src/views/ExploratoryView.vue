<template>
  <AuthenticatedLayout>
    <div class="flex flex-col gap-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-slate-900">Análisis Exploratorio de Datos</h1>
          <p class="text-slate-600">Datos históricos de consumo energético 1998-2018</p>
        </div>
        <Button @click="router.push('/visualizations')" class="w-full sm:w-auto">
          Ver Predicciones
        </Button>
      </div>

      <!-- Dataset Overview -->
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-medium text-slate-600">Total Registros</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">{{ datasetStats.totalRecords }}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-medium text-slate-600">Compañías</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">{{ datasetStats.states }}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-medium text-slate-600">Años</CardTitle>
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
            class="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-md"
          >
            <div class="text-sm text-slate-700">
              <strong>Fecha y hora seleccionada:</strong> {{ formattedDateTime }}
            </div>
          </div>
          <div v-if="isAnalyzing" class="flex flex-col gap-2">
            <div class="flex justify-between text-sm">
              <span>Progreso del análisis</span>
              <span>{{ analysisProgress }}%</span>
            </div>
            <!-- Simple progress bar, replace with shadcn-vue Progress when available -->
            <div class="w-full bg-slate-200 rounded-full h-2.5">
              <div
                class="bg-unmsm-slate h-2.5 rounded-full"
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
                  ? 'border-b-2 border-unmsm-slate text-unmsm-slate'
                  : 'text-slate-600',
              ]"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>
        <div v-if="activeTab === 'analysis'" class="flex flex-col gap-4">
          <!-- Prediction Results -->
          <Card v-if="predictionData">
            <CardHeader>
              <div class="flex items-center justify-between">
                <div>
                  <CardTitle class="flex items-center gap-2">
                    <BarChart3 class="h-5 w-5" />
                    Resultados de Predicción
                  </CardTitle>
                  <CardDescription>
                    Predicción de consumo energético para {{ predictionData.input_data.company }} el
                    {{ new Date(predictionData.input_data.datetime).toLocaleString('es-ES') }}
                  </CardDescription>
                </div>
                <Button 
                  @click="exportToPDF" 
                  variant="outline" 
                  class="flex items-center gap-2"
                >
                  <FileText class="h-4 w-4" />
                  Exportar PDF
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- Main Prediction -->
                <div
                  class="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-lg border border-slate-200"
                >
                  <div class="text-sm text-unmsm-slate font-medium mb-2">Predicción Principal</div>
                  <div class="text-3xl font-bold text-slate-900">
                    {{ predictionData.prediction.toFixed(0) }}
                  </div>
                  <div class="text-sm text-slate-700">GWh</div>
                </div>

                <!-- Input Data -->
                <div class="bg-slate-50 p-6 rounded-lg border border-slate-200">
                  <div class="text-sm text-slate-600 font-medium mb-2">Datos de Entrada</div>
                  <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                      <span class="text-slate-600">Compañía:</span>
                      <span class="font-medium">{{ predictionData.input_data.company }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-slate-600">Fecha:</span>
                      <span class="font-medium">{{
                        new Date(predictionData.input_data.datetime).toLocaleDateString('es-ES')
                      }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-slate-600">Hora:</span>
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
                <div class="bg-slate-50 p-6 rounded-lg border border-slate-200">
                  <div class="text-sm text-slate-600 font-medium mb-2">Características</div>
                  <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                      <span class="text-slate-600">Hora:</span>
                      <span class="font-medium">{{ predictionData.parsed_features.hour }}:00</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-slate-600">Día de semana:</span>
                      <span class="font-medium">{{
                        formatDayOfWeek(predictionData.parsed_features.dayofweek)
                      }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-slate-600">Mes:</span>
                      <span class="font-medium">{{
                        months[predictionData.parsed_features.month - 1]?.label
                      }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-slate-600">Fin de semana:</span>
                      <span class="font-medium">{{
                        predictionData.parsed_features.is_weekend ? 'Sí' : 'No'
                      }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-slate-600">Hora pico:</span>
                      <span class="font-medium">{{
                        predictionData.parsed_features.is_peak ? 'Sí' : 'No'
                      }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Comparison Chart: Lags vs Prediction (Chart.js) -->
              <div class="mt-6">
                <h4 class="text-lg font-semibold mb-4">Comparativo: Lags vs Predicción</h4>
                <div class="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <div class="h-64">
                    <Bar v-if="barData" :data="barData" :options="barOptions" />
                  </div>
                </div>
              </div>

              <!-- Lag Values -->
              <div class="mt-6">
                <h4 class="text-lg font-semibold mb-4">Valores de Lag (Histórico)</h4>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div class="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <div class="text-sm text-slate-600 font-medium mb-1">
                      Lag 1 (Hora anterior)
                    </div>
                    <div class="text-xl font-bold text-slate-900">
                      {{ predictionData.parsed_features.lag_1.toFixed(0) }}
                    </div>
                    <div class="text-sm text-slate-700">GWh</div>
                  </div>
                  <div class="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <div class="text-sm text-slate-600 font-medium mb-1">
                      Lag 2 (2 horas antes)
                    </div>
                    <div class="text-xl font-bold text-slate-900">
                      {{ predictionData.parsed_features.lag_2.toFixed(0) }}
                    </div>
                    <div class="text-sm text-slate-700">GWh</div>
                  </div>
                  <div class="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <div class="text-sm text-slate-600 font-medium mb-1">
                      Lag 3 (3 horas antes)
                    </div>
                    <div class="text-xl font-bold text-slate-900">
                      {{ predictionData.parsed_features.lag_3.toFixed(0) }}
                    </div>
                    <div class="text-sm text-slate-700">GWh</div>
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
import { BarChart3, Settings, Loader2, FileText } from 'lucide-vue-next'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { useAuthStore } from '@/stores/auth'
import { apiRequest } from '@/lib/api'
// Chart.js
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

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

// Chart.js dataset and options
const barData = computed<any>(() => {
  if (!predictionData.value) return null
  const { lag_1, lag_2, lag_3 } = predictionData.value.parsed_features
  return {
    labels: ['Lag 3', 'Lag 2', 'Lag 1', 'Predicción'],
    datasets: [
      {
        label: 'GWh',
        data: [lag_3, lag_2, lag_1, predictionData.value.prediction],
        backgroundColor: ['#cbd5e1', '#94a3b8', '#64748b', '#10b981'],
        borderColor: ['#94a3b8', '#64748b', '#475569', '#059669'],
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  }
})

const barOptions = computed<any>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top' as const,
      labels: { color: '#334155', font: { size: 12 } },
    },
    title: { display: false },
    tooltip: { callbacks: { label: (ctx: any) => `${ctx.parsed.y.toFixed(0)} GWh` } },
  },
  scales: {
    x: {
      ticks: { color: '#475569', font: { size: 12 } },
      grid: { display: false },
    },
    y: {
      beginAtZero: true,
      ticks: { color: '#64748b', font: { size: 11 } },
      grid: { color: 'rgba(148, 163, 184, 0.2)' },
    },
  },
}))

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
      // Type assertion to ensure correct type
      predictionData.value = response.data as typeof predictionData.value
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

const exportToPDF = async () => {
  if (!predictionData.value) return

  try {
    // Create a temporary iframe to isolate styles completely
    const iframe = document.createElement('iframe')
    iframe.style.position = 'absolute'
    iframe.style.left = '-9999px'
    iframe.style.top = '0'
    iframe.style.width = '800px'
    iframe.style.height = '1200px'
    iframe.style.border = 'none'
    
    document.body.appendChild(iframe)
    
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
    if (!iframeDoc) throw new Error('Could not access iframe document')
    
    // Create a clean container inside the iframe
    const pdfContainer = iframeDoc.createElement('div')
    pdfContainer.style.width = '100%'
    pdfContainer.style.backgroundColor = '#ffffff'
    pdfContainer.style.padding = '20px'
    pdfContainer.style.fontFamily = 'Arial, sans-serif'
    pdfContainer.style.color = '#000000'
    pdfContainer.style.fontSize = '14px'
    pdfContainer.style.lineHeight = '1.5'
    
    // Add header
    const header = document.createElement('div')
    header.innerHTML = `
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #475569; padding-bottom: 20px;">
        <h1 style="color: #1e293b; font-size: 24px; margin: 0; font-weight: bold;">Sistema de Predicción de Consumo Energético</h1>
        <h2 style="color: #475569; font-size: 18px; margin: 10px 0 0 0;">Análisis Exploratorio de Datos</h2>
        <p style="color: #64748b; font-size: 14px; margin: 5px 0 0 0;">Generado el: ${new Date().toLocaleString('es-ES')}</p>
      </div>
    `
    pdfContainer.appendChild(header)
    
    // Add analysis parameters
    const paramsInfo = document.createElement('div')
    paramsInfo.innerHTML = `
      <div style="margin-bottom: 20px; padding: 15px; background-color: #f8fafc; border-radius: 8px; border-left: 4px solid #475569;">
        <h3 style="color: #1e293b; font-size: 16px; margin: 0 0 10px 0;">Parámetros del Análisis</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 14px;">
          <div><strong>Compañía:</strong> ${predictionData.value.input_data.company}</div>
          <div><strong>Fecha y Hora:</strong> ${new Date(predictionData.value.input_data.datetime).toLocaleString('es-ES')}</div>
          <div><strong>Método de Predicción:</strong> ${predictionData.value.prediction_meta.forecast_method}</div>
          <div><strong>Pasos de Predicción:</strong> ${predictionData.value.prediction_meta.steps}</div>
        </div>
      </div>
    `
    pdfContainer.appendChild(paramsInfo)
    
    // Add main prediction result
    const predictionResult = document.createElement('div')
    predictionResult.innerHTML = `
      <div style="margin-bottom: 20px; padding: 20px; background-color: #f0f9ff; border-radius: 8px; border: 2px solid #0ea5e9;">
        <h3 style="color: #1e293b; font-size: 18px; margin: 0 0 15px 0; text-align: center;">Resultado de la Predicción</h3>
        <div style="text-align: center;">
          <div style="font-size: 36px; font-weight: bold; color: #059669; margin-bottom: 5px;">
            ${predictionData.value.prediction.toFixed(2)}
          </div>
          <div style="font-size: 16px; color: #64748b;">Gigawatts por Hora (GWh)</div>
        </div>
      </div>
    `
    pdfContainer.appendChild(predictionResult)
    
    // Add parsed features
    const featuresInfo = document.createElement('div')
    featuresInfo.innerHTML = `
      <div style="margin-bottom: 20px;">
        <h3 style="color: #1e293b; font-size: 16px; margin: 0 0 15px 0;">Características Extraídas</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 14px;">
          <div style="padding: 8px; background-color: #f8fafc; border-radius: 4px;">
            <strong>Hora:</strong> ${predictionData.value.parsed_features.hour}:00
          </div>
          <div style="padding: 8px; background-color: #f8fafc; border-radius: 4px;">
            <strong>Día de la semana:</strong> ${formatDayOfWeek(predictionData.value.parsed_features.dayofweek)}
          </div>
          <div style="padding: 8px; background-color: #f8fafc; border-radius: 4px;">
            <strong>Mes:</strong> ${predictionData.value.parsed_features.month}
          </div>
          <div style="padding: 8px; background-color: #f8fafc; border-radius: 4px;">
            <strong>Año:</strong> ${predictionData.value.parsed_features.year}
          </div>
          <div style="padding: 8px; background-color: #f8fafc; border-radius: 4px;">
            <strong>Es fin de semana:</strong> ${predictionData.value.parsed_features.is_weekend ? 'Sí' : 'No'}
          </div>
          <div style="padding: 8px; background-color: #f8fafc; border-radius: 4px;">
            <strong>Es hora pico:</strong> ${predictionData.value.parsed_features.is_peak ? 'Sí' : 'No'}
          </div>
        </div>
      </div>
    `
    pdfContainer.appendChild(featuresInfo)
    
    // Add lag values
    const lagInfo = document.createElement('div')
    lagInfo.innerHTML = `
      <div style="margin-bottom: 20px;">
        <h3 style="color: #1e293b; font-size: 16px; margin: 0 0 15px 0;">Valores de Lag Utilizados</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; font-size: 14px;">
          <div style="padding: 12px; background-color: #f0f9ff; border-radius: 6px; text-align: center;">
            <div style="font-weight: bold; color: #0ea5e9;">Lag 1</div>
            <div style="font-size: 18px; font-weight: bold; color: #1e293b;">${predictionData.value.prediction_meta.last_real_lag_1.toFixed(2)}</div>
          </div>
          <div style="padding: 12px; background-color: #f0f9ff; border-radius: 6px; text-align: center;">
            <div style="font-weight: bold; color: #0ea5e9;">Lag 2</div>
            <div style="font-size: 18px; font-weight: bold; color: #1e293b;">${predictionData.value.prediction_meta.last_real_lag_2.toFixed(2)}</div>
          </div>
          <div style="padding: 12px; background-color: #f0f9ff; border-radius: 6px; text-align: center;">
            <div style="font-weight: bold; color: #0ea5e9;">Lag 3</div>
            <div style="font-size: 18px; font-weight: bold; color: #1e293b;">${predictionData.value.prediction_meta.last_real_lag_3.toFixed(2)}</div>
          </div>
        </div>
      </div>
    `
    pdfContainer.appendChild(lagInfo)
    
    // Add metadata
    const metadata = document.createElement('div')
    metadata.innerHTML = `
      <div style="margin-bottom: 20px; padding: 15px; background-color: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">
        <h3 style="color: #1e293b; font-size: 16px; margin: 0 0 10px 0;">Información del Análisis</h3>
        <div style="font-size: 14px; color: #64748b;">
          <p><strong>ID de Predicción:</strong> ${predictionData.value.prediction_id}</p>
          <p><strong>Creado por:</strong> ${predictionData.value.created_by}</p>
          <p><strong>Fecha de creación:</strong> ${new Date(predictionData.value.created_at).toLocaleString('es-ES')}</p>
        </div>
      </div>
    `
    pdfContainer.appendChild(metadata)
    
    // Add footer
    const footer = document.createElement('div')
    footer.innerHTML = `
      <div style="margin-top: 30px; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px;">
        <p style="color: #64748b; font-size: 12px; margin: 0;">© 2024 Universidad Nacional Mayor de San Marcos</p>
        <p style="color: #64748b; font-size: 12px; margin: 5px 0 0 0;">Sistema de Predicción de Consumo Energético</p>
      </div>
    `
    pdfContainer.appendChild(footer)
    
    // Add to iframe document
    iframeDoc.body.appendChild(pdfContainer)
    
    // Convert to canvas
    const canvas = await html2canvas(pdfContainer, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      removeContainer: true
    })
    
    // Remove temporary iframe
    document.body.removeChild(iframe)
    
    // Create PDF
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    const imgWidth = 210
    const pageHeight = 295
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight
    
    let position = 0
    
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight
    
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }
    
    // Save PDF
    const fileName = `analisis_exploratorio_${predictionData.value.input_data.company}_${new Date(predictionData.value.input_data.datetime).toISOString().split('T')[0]}.pdf`
    pdf.save(fileName)
    
  } catch (error) {
    console.error('Error exporting to PDF:', error)
    alert('Error al exportar el PDF. Intente nuevamente.')
  }
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
