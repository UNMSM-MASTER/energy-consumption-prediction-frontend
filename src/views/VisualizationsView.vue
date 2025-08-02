<template>
  <AuthenticatedLayout page-title="Predicciones" page-description="Tabla de predicciones de consumo energético">
    <div class="p-6 flex flex-col gap-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-slate-900">Predicciones</h1>
          <p class="text-slate-600">Tabla de predicciones de consumo energético</p>
        </div>
        <div class="flex gap-2">
          <Button 
            @click="exportToPDF" 
            variant="outline" 
            class="flex items-center gap-2"
            :disabled="isLoading || filteredPredictions.length === 0"
          >
            <FileText class="h-4 w-4" />
            Exportar PDF
          </Button>
        </div>
      </div>

      <!-- Filters -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Filter class="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex flex-col gap-2">
              <Label for="company-filter">Empresa</Label>
              <select 
                v-model="filters.company"
                class="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-unmsm-slate focus:border-unmsm-slate"
              >
                <option value="">Todas las empresas</option>
                <option v-for="company in companies" :key="company" :value="company">
                  {{ company }}
                </option>
              </select>
            </div>

            <div class="flex flex-col gap-2">
              <Label for="sort-by">Ordenar por</Label>
              <Select v-model="sortBy">
                <SelectTrigger>
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at">Fecha de creación</SelectItem>
                  <SelectItem value="prediction">Predicción</SelectItem>
                  <SelectItem value="company">Empresa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div class="flex justify-end mt-4">
            <Button variant="outline" @click="clearFilters" class="flex items-center gap-2">
              <X class="h-4 w-4" />
              Limpiar filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      <!-- Table -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Table class="h-5 w-5" />
            Predicciones
            <Badge variant="secondary" class="ml-2">{{ filteredPredictions.length }} resultados</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div v-if="isLoading" class="flex items-center justify-center py-12">
            <Loader2 class="h-8 w-8 animate-spin text-unmsm-slate" />
            <span class="ml-2 text-slate-600">Cargando predicciones...</span>
          </div>

          <div v-else-if="hasError" class="text-center py-12">
            <AlertTriangle class="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h3 class="text-lg font-medium text-slate-900 mb-2">Error al cargar las predicciones</h3>
            <p class="text-slate-600 mb-4">{{ errorMessage }}</p>
            <Button @click="loadPredictions" variant="outline">
              <RefreshCw class="h-4 w-4 mr-2" />
              Reintentar
            </Button>
          </div>

          <div v-else-if="filteredPredictions.length === 0" class="text-center py-12">
            <BarChart3 class="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 class="text-lg font-medium text-slate-900 mb-2">No se encontraron predicciones</h3>
            <p class="text-slate-600">Intenta ajustar los filtros o crear una nueva predicción.</p>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="w-full border-collapse">
              <thead>
                <tr class="border-b border-slate-200 bg-slate-50">
                  <th class="text-left py-3 px-4 font-medium text-slate-700">ID</th>
                  <th class="text-left py-3 px-4 font-medium text-slate-700">Empresa</th>
                  <th class="text-left py-3 px-4 font-medium text-slate-700">Fecha/Hora</th>
                  <th class="text-left py-3 px-4 font-medium text-slate-700">Predicción (GWh)</th>
                  <th class="text-left py-3 px-4 font-medium text-slate-700">Creado por</th>
                  <th class="text-left py-3 px-4 font-medium text-slate-700">Fecha de creación</th>
                  <th class="text-left py-3 px-4 font-medium text-slate-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="prediction in paginatedPredictions"
                  :key="prediction.prediction_id"
                  class="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  <td class="py-3 px-4 text-sm font-mono text-slate-600">
                    {{ prediction.prediction_id.slice(0, 8) }}...
                  </td>
                  <td class="py-3 px-4">
                    <Badge variant="outline">{{ prediction.input_data.company }}</Badge>
                  </td>
                  <td class="py-3 px-4 text-sm text-slate-900">
                    {{ formatDateTime(prediction.input_data.datetime) }}
                  </td>
                  <td class="py-3 px-4">
                    <span class="text-lg font-semibold text-unmsm-slate">
                      {{ prediction.prediction.toFixed(2) }}
                    </span>
                    <span class="text-sm text-slate-500 ml-1">GWh</span>
                  </td>
                  <td class="py-3 px-4 text-sm text-slate-700">
                    {{ prediction.created_by }}
                  </td>
                  <td class="py-3 px-4 text-sm text-slate-600">
                    {{ formatDateTime(prediction.created_at) }}
                  </td>
                  <td class="py-3 px-4">
                    <div class="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        @click="exportSinglePredictionToPDF(prediction)"
                        class="text-red-600 hover:text-red-700"
                        title="Exportar PDF"
                      >
                        <FileText class="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div v-if="filteredPredictions.length > itemsPerPage" class="flex items-center justify-between mt-6">
            <div class="text-sm text-slate-600">
              Mostrando {{ (currentPage - 1) * itemsPerPage + 1 }} a
              {{ Math.min(currentPage * itemsPerPage, filteredPredictions.length) }} de
              {{ filteredPredictions.length }} resultados
            </div>
            <div class="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                @click="currentPage = Math.max(1, currentPage - 1)"
                :disabled="currentPage === 1"
              >
                <ChevronLeft class="h-4 w-4" />
              </Button>
              <span class="text-sm text-slate-600">
                Página {{ currentPage }} de {{ totalPages }}
              </span>
              <Button
                variant="outline"
                size="sm"
                @click="currentPage = Math.min(totalPages, currentPage + 1)"
                :disabled="currentPage === totalPages"
              >
                <ChevronRight class="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </AuthenticatedLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  BarChart3,
  Table,
  Filter,
  Loader2,
  ChevronLeft,
  ChevronRight,
  X,
  AlertTriangle,
  RefreshCw,
  FileText,
} from 'lucide-vue-next'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
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

// Reactive state
const predictions = ref<PredictionData[]>([])
const isLoading = ref(false)
const hasError = ref(false)
const errorMessage = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Filters
const filters = ref({
  company: '',
})

const sortBy = ref('created_at')

// Available companies
const companies = ['AEP', 'DAYTON', 'DOM', 'DUQ', 'PJME', 'PJMW']

// Computed properties
const filteredPredictions = computed(() => {
  let filtered = [...predictions.value]

  // Filter by company
  if (filters.value.company) {
    filtered = filtered.filter(p => p.input_data.company === filters.value.company)
  }



  // Sort
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'created_at':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      case 'prediction':
        return b.prediction - a.prediction
      case 'company':
        return a.input_data.company.localeCompare(b.input_data.company)
      default:
        return 0
    }
  })

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredPredictions.value.length / itemsPerPage.value))

const paginatedPredictions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredPredictions.value.slice(start, end)
})

const activeFiltersCount = computed(() => {
  let count = 0
  if (filters.value.company) count++
  return count
})

// Methods
const formatDateTime = (dateTime: string) => {
  return new Date(dateTime).toLocaleString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const loadPredictions = async () => {
  isLoading.value = true
  hasError.value = false
  errorMessage.value = ''
  
  try {
    // Check if user is authenticated
    if (!authStore.isAuthenticated) {
      throw new Error('Usuario no autenticado')
    }

    // Check if token exists
    const token = localStorage.getItem('auth_token')
    if (!token) {
      throw new Error('Token de autenticación no encontrado')
    }

    console.log('Loading predictions from API with token:', token.substring(0, 20) + '...')
    
    const response = await apiRequest('/prediction/predictions', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (response.error) {
      console.error('API Error:', response.error)
      
      // Handle authentication errors
      if (response.error.includes('401') || response.error.includes('Unauthorized')) {
        console.error('Authentication error, redirecting to login')
        authStore.logout()
        router.push('/login')
        return
      }
      
      throw new Error(response.error)
    }

    if (response.data && Array.isArray(response.data)) {
      console.log('Predictions loaded successfully:', response.data.length, 'predictions')
      predictions.value = response.data as PredictionData[]
    } else {
      console.warn('No data received from API')
      predictions.value = []
    }
  } catch (error) {
    console.error('Error loading predictions from API:', error)
    predictions.value = []
    hasError.value = true
    
    if (error instanceof Error) {
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        errorMessage.value = 'Sesión expirada. Redirigiendo al login...'
        setTimeout(() => {
          authStore.logout()
          router.push('/login')
        }, 2000)
      } else {
        errorMessage.value = error.message
      }
    } else {
      errorMessage.value = 'Error al cargar las predicciones'
    }
  } finally {
    isLoading.value = false
  }
}





const clearFilters = () => {
  filters.value = {
    company: '',
  }
  sortBy.value = 'created_at'
  currentPage.value = 1
}



const exportToPDF = async () => {
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
        <h2 style="color: #475569; font-size: 18px; margin: 10px 0 0 0;">Reporte de Predicciones</h2>
        <p style="color: #64748b; font-size: 14px; margin: 5px 0 0 0;">Generado el: ${new Date().toLocaleString('es-ES')}</p>
      </div>
    `
    pdfContainer.appendChild(header)
    
    // Add filters info
    if (filters.value.company || sortBy.value !== 'created_at') {
      const filtersInfo = document.createElement('div')
      filtersInfo.innerHTML = `
        <div style="margin-bottom: 20px; padding: 15px; background-color: #f8fafc; border-radius: 8px; border-left: 4px solid #475569;">
          <h3 style="color: #1e293b; font-size: 16px; margin: 0 0 10px 0;">Filtros Aplicados</h3>
          <p style="color: #64748b; font-size: 14px; margin: 5px 0;">
            ${filters.value.company ? `Empresa: ${filters.value.company}` : ''}
            ${filters.value.company && sortBy.value !== 'created_at' ? ' | ' : ''}
            ${sortBy.value !== 'created_at' ? `Ordenado por: ${sortBy.value === 'prediction' ? 'Predicción' : 'Empresa'}` : ''}
          </p>
        </div>
      `
      pdfContainer.appendChild(filtersInfo)
    }
    
    // Create table
    const table = document.createElement('table')
    table.style.width = '100%'
    table.style.borderCollapse = 'collapse'
    table.style.marginTop = '20px'
    
    // Table header
    const thead = document.createElement('thead')
    thead.innerHTML = `
      <tr style="background-color: #475569; color: white;">
        <th style="padding: 12px; text-align: left; border: 1px solid #64748b; font-size: 12px;">ID</th>
        <th style="padding: 12px; text-align: left; border: 1px solid #64748b; font-size: 12px;">Empresa</th>
        <th style="padding: 12px; text-align: left; border: 1px solid #64748b; font-size: 12px;">Fecha/Hora</th>
        <th style="padding: 12px; text-align: left; border: 1px solid #64748b; font-size: 12px;">Predicción (GWh)</th>
        <th style="padding: 12px; text-align: left; border: 1px solid #64748b; font-size: 12px;">Creado por</th>
        <th style="padding: 12px; text-align: left; border: 1px solid #64748b; font-size: 12px;">Fecha de creación</th>
      </tr>
    `
    table.appendChild(thead)
    
    // Table body
    const tbody = document.createElement('tbody')
    filteredPredictions.value.forEach((prediction, index) => {
      const row = document.createElement('tr')
      row.style.backgroundColor = index % 2 === 0 ? '#ffffff' : '#f8fafc'
      row.innerHTML = `
        <td style="padding: 10px; border: 1px solid #e2e8f0; font-size: 11px; font-family: monospace;">${prediction.prediction_id}</td>
        <td style="padding: 10px; border: 1px solid #e2e8f0; font-size: 11px;">${prediction.input_data.company}</td>
        <td style="padding: 10px; border: 1px solid #e2e8f0; font-size: 11px;">${formatDateTime(prediction.input_data.datetime)}</td>
        <td style="padding: 10px; border: 1px solid #e2e8f0; font-size: 11px; font-weight: bold; color: #059669;">${prediction.prediction.toFixed(2)}</td>
        <td style="padding: 10px; border: 1px solid #e2e8f0; font-size: 11px;">${prediction.created_by}</td>
        <td style="padding: 10px; border: 1px solid #e2e8f0; font-size: 11px;">${formatDateTime(prediction.created_at)}</td>
      `
      tbody.appendChild(row)
    })
    table.appendChild(tbody)
    pdfContainer.appendChild(table)
    
    // Add summary
    const summary = document.createElement('div')
    summary.innerHTML = `
      <div style="margin-top: 30px; padding: 15px; background-color: #f0f9ff; border-radius: 8px; border-left: 4px solid #0ea5e9;">
        <h3 style="color: #1e293b; font-size: 16px; margin: 0 0 10px 0;">Resumen</h3>
        <p style="color: #64748b; font-size: 14px; margin: 5px 0;">Total de predicciones: ${filteredPredictions.value.length}</p>
        <p style="color: #64748b; font-size: 14px; margin: 5px 0;">Predicción promedio: ${(filteredPredictions.value.reduce((sum, p) => sum + p.prediction, 0) / filteredPredictions.value.length).toFixed(2)} GWh</p>
        <p style="color: #64748b; font-size: 14px; margin: 5px 0;">Predicción máxima: ${Math.max(...filteredPredictions.value.map(p => p.prediction)).toFixed(2)} GWh</p>
        <p style="color: #64748b; font-size: 14px; margin: 5px 0;">Predicción mínima: ${Math.min(...filteredPredictions.value.map(p => p.prediction)).toFixed(2)} GWh</p>
      </div>
    `
    pdfContainer.appendChild(summary)
    
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
    const fileName = `predicciones_consumo_energetico_${new Date().toISOString().split('T')[0]}.pdf`
    pdf.save(fileName)
    
  } catch (error) {
    console.error('Error exporting to PDF:', error)
    alert('Error al exportar el PDF. Intente nuevamente.')
  }
}

const exportSinglePredictionToPDF = async (prediction: PredictionData) => {
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
        <h2 style="color: #475569; font-size: 18px; margin: 10px 0 0 0;">Reporte de Predicción Individual</h2>
        <p style="color: #64748b; font-size: 14px; margin: 5px 0 0 0;">Generado el: ${new Date().toLocaleString('es-ES')}</p>
      </div>
    `
    pdfContainer.appendChild(header)
    
    // Add prediction details
    const predictionDetails = document.createElement('div')
    predictionDetails.innerHTML = `
      <div style="margin-bottom: 20px; padding: 20px; background-color: #f0f9ff; border-radius: 8px; border: 2px solid #0ea5e9;">
        <h3 style="color: #1e293b; font-size: 18px; margin: 0 0 15px 0; text-align: center;">Resultado de la Predicción</h3>
        <div style="text-align: center;">
          <div style="font-size: 36px; font-weight: bold; color: #059669; margin-bottom: 5px;">
            ${prediction.prediction.toFixed(2)}
          </div>
          <div style="font-size: 16px; color: #64748b;">Gigawatts por Hora (GWh)</div>
        </div>
      </div>
    `
    pdfContainer.appendChild(predictionDetails)
    
    // Add input data
    const inputData = document.createElement('div')
    inputData.innerHTML = `
      <div style="margin-bottom: 20px; padding: 15px; background-color: #f8fafc; border-radius: 8px; border-left: 4px solid #475569;">
        <h3 style="color: #1e293b; font-size: 16px; margin: 0 0 10px 0;">Datos de Entrada</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 14px;">
          <div><strong>Compañía:</strong> ${prediction.input_data.company}</div>
          <div><strong>Fecha y Hora:</strong> ${formatDateTime(prediction.input_data.datetime)}</div>
          <div><strong>ID de Predicción:</strong> ${prediction.prediction_id}</div>
          <div><strong>Creado por:</strong> ${prediction.created_by}</div>
        </div>
      </div>
    `
    pdfContainer.appendChild(inputData)
    
    // Add parsed features
    const featuresInfo = document.createElement('div')
    featuresInfo.innerHTML = `
      <div style="margin-bottom: 20px;">
        <h3 style="color: #1e293b; font-size: 16px; margin: 0 0 15px 0;">Características Extraídas</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 14px;">
          <div style="padding: 8px; background-color: #f8fafc; border-radius: 4px;">
            <strong>Hora:</strong> ${prediction.parsed_features.hour}:00
          </div>
          <div style="padding: 8px; background-color: #f8fafc; border-radius: 4px;">
            <strong>Día de la semana:</strong> ${['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'][prediction.parsed_features.dayofweek]}
          </div>
          <div style="padding: 8px; background-color: #f8fafc; border-radius: 4px;">
            <strong>Mes:</strong> ${prediction.parsed_features.month}
          </div>
          <div style="padding: 8px; background-color: #f8fafc; border-radius: 4px;">
            <strong>Año:</strong> ${prediction.parsed_features.year}
          </div>
          <div style="padding: 8px; background-color: #f8fafc; border-radius: 4px;">
            <strong>Es fin de semana:</strong> ${prediction.parsed_features.is_weekend ? 'Sí' : 'No'}
          </div>
          <div style="padding: 8px; background-color: #f8fafc; border-radius: 4px;">
            <strong>Es hora pico:</strong> ${prediction.parsed_features.is_peak ? 'Sí' : 'No'}
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
            <div style="font-size: 18px; font-weight: bold; color: #1e293b;">${prediction.prediction_meta.last_real_lag_1.toFixed(2)}</div>
          </div>
          <div style="padding: 12px; background-color: #f0f9ff; border-radius: 6px; text-align: center;">
            <div style="font-weight: bold; color: #0ea5e9;">Lag 2</div>
            <div style="font-size: 18px; font-weight: bold; color: #1e293b;">${prediction.prediction_meta.last_real_lag_2.toFixed(2)}</div>
          </div>
          <div style="padding: 12px; background-color: #f0f9ff; border-radius: 6px; text-align: center;">
            <div style="font-weight: bold; color: #0ea5e9;">Lag 3</div>
            <div style="font-size: 18px; font-weight: bold; color: #1e293b;">${prediction.prediction_meta.last_real_lag_3.toFixed(2)}</div>
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
          <p><strong>Método de Predicción:</strong> ${prediction.prediction_meta.forecast_method}</p>
          <p><strong>Pasos de Predicción:</strong> ${prediction.prediction_meta.steps}</p>
          <p><strong>Fecha de creación:</strong> ${formatDateTime(prediction.created_at)}</p>
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
    const fileName = `prediccion_${prediction.input_data.company}_${new Date(prediction.input_data.datetime).toISOString().split('T')[0]}.pdf`
    pdf.save(fileName)
    
  } catch (error) {
    console.error('Error exporting single prediction to PDF:', error)
    alert('Error al exportar el PDF. Intente nuevamente.')
  }
}



// Watch for filter changes
watch([filters, sortBy], () => {
  currentPage.value = 1
})



// Lifecycle
onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  
  // Verify token is still valid
  const token = localStorage.getItem('auth_token')
  if (!token) {
    console.error('No token found, redirecting to login')
    authStore.logout()
    router.push('/login')
    return
  }
  
  loadPredictions()
})
</script>

<style scoped>
/* Add any additional custom styles if needed */
</style> 