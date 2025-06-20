<template>
  <AuthenticatedLayout>
    <div class="space-y-6">
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
            <CardTitle class="text-sm font-medium text-gray-600">Estados</CardTitle>
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
        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-medium text-gray-600">Valores Faltantes</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold text-orange-600">{{ datasetStats.missingValues }}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-medium text-gray-600">Outliers</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold text-red-600">{{ datasetStats.outliers }}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-sm font-medium text-gray-600">Calidad</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold text-green-600">{{ datasetStats.dataQuality }}</div>
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
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div class="space-y-2">
              <Label for="state">Estado</Label>
              <!-- Simple Select, replace with shadcn-vue Select when available -->
              <select id="state" v-model="selectedState" class="w-full border rounded-md p-2">
                <option value="all">Todos los Estados</option>
                <option
                  v-for="state in states.slice(1)"
                  :key="state"
                  :value="state.toLowerCase().replace(' ', '-')"
                >
                  {{ state }}
                </option>
              </select>
            </div>
            <div class="space-y-2">
              <Label for="period">Período</Label>
              <select id="period" v-model="selectedPeriod" class="w-full border rounded-md p-2">
                <option value="1998-2018">1998-2018 (Completo)</option>
                <option value="1998-2008">1998-2008 (Década 1)</option>
                <option value="2009-2018">2009-2018 (Década 2)</option>
                <option value="2015-2018">2015-2018 (Reciente)</option>
              </select>
            </div>
            <div class="space-y-2">
              <Label>Acción</Label>
              <Button @click="handleAnalysis" :disabled="isAnalyzing" class="w-full">
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
          </div>
          <div v-if="isAnalyzing" class="space-y-2">
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
        <div v-if="activeTab === 'statistics'" class="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Estadísticas Descriptivas</CardTitle>
              <CardDescription>Resumen estadístico por estado y período</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="border-b">
                      <th class="text-left p-2">Métrica</th>
                      <th class="text-right p-2">Valor</th>
                      <th class="text-right p-2">Unidad</th>
                      <th class="text-center p-2">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="border-b">
                      <td class="p-2">Consumo Promedio</td>
                      <td class="text-right p-2">2,847.3</td>
                      <td class="text-right p-2">GWh</td>
                      <td class="text-center p-2">
                        <!-- Simple badge, replace with shadcn-vue Badge when available -->
                        <span
                          class="inline-block px-2 py-1 rounded bg-gray-200 text-gray-700 text-xs"
                          >Normal</span
                        >
                      </td>
                    </tr>
                    <tr class="border-b">
                      <td class="p-2">Desviación Estándar</td>
                      <td class="text-right p-2">1,234.7</td>
                      <td class="text-right p-2">GWh</td>
                      <td class="text-center p-2">
                        <span
                          class="inline-block px-2 py-1 rounded bg-gray-200 text-gray-700 text-xs"
                          >Normal</span
                        >
                      </td>
                    </tr>
                    <tr class="border-b">
                      <td class="p-2">Valor Máximo</td>
                      <td class="text-right p-2">8,945.2</td>
                      <td class="text-right p-2">GWh</td>
                      <td class="text-center p-2">
                        <span class="inline-block px-2 py-1 rounded bg-red-200 text-red-700 text-xs"
                          >Alto</span
                        >
                      </td>
                    </tr>
                    <tr class="border-b">
                      <td class="p-2">Valor Mínimo</td>
                      <td class="text-right p-2">234.1</td>
                      <td class="text-right p-2">GWh</td>
                      <td class="text-center p-2">
                        <span
                          class="inline-block px-2 py-1 rounded bg-gray-200 text-gray-700 text-xs"
                          >Normal</span
                        >
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
        <div v-else-if="activeTab === 'trends'" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card v-for="(trend, index) in analysisResults.trends" :key="index">
              <CardHeader>
                <CardTitle class="text-lg">{{ trend.metric }}</CardTitle>
              </CardHeader>
              <CardContent>
                <div class="text-3xl font-bold mb-2">{{ trend.value }}</div>
                <span :class="badgeClass(trend.status)">
                  {{
                    trend.status === 'normal'
                      ? 'Normal'
                      : trend.status === 'high'
                        ? 'Alto'
                        : 'Fuerte'
                  }}
                </span>
              </CardContent>
            </Card>
          </div>
          <!-- Simple alert, replace with shadcn-vue Alert when available -->
          <div
            class="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-md p-4 mt-4"
          >
            <Info class="h-4 w-4 text-blue-500" />
            <span class="text-sm text-blue-700">
              Se identificaron patrones estacionales consistentes con picos en verano e invierno. La
              tendencia general muestra un crecimiento sostenido del 2.4% anual.
            </span>
          </div>
        </div>
        <div v-else-if="activeTab === 'outliers'" class="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle class="flex items-center gap-2">
                <AlertTriangle class="h-5 w-5 text-orange-500" />
                Outliers Detectados
              </CardTitle>
              <CardDescription
                >Valores atípicos identificados (&gt;3 desviaciones estándar)</CardDescription
              >
            </CardHeader>
            <CardContent>
              <div class="space-y-4">
                <div
                  v-for="(outlier, index) in analysisResults.outliers"
                  :key="index"
                  class="border rounded-lg p-4"
                >
                  <div class="flex justify-between items-start mb-2">
                    <div>
                      <h4 class="font-semibold">{{ outlier.state }} - {{ outlier.year }}</h4>
                      <p class="text-sm text-gray-600">{{ outlier.reason }}</p>
                    </div>
                    <span class="inline-block px-2 py-1 rounded bg-red-200 text-red-700 text-xs">{{
                      outlier.value
                    }}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div v-else-if="activeTab === 'export'" class="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle class="flex items-center gap-2">
                <Download class="h-5 w-5" />
                Exportar Datos Limpios
              </CardTitle>
              <CardDescription>Descargar datasets procesados en formato estándar</CardDescription>
            </CardHeader>
            <CardContent class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" class="justify-start">
                  <Download class="mr-2 h-4 w-4" />
                  Descargar CSV
                </Button>
                <Button variant="outline" class="justify-start">
                  <Download class="mr-2 h-4 w-4" />
                  Descargar Parquet
                </Button>
              </div>
              <div
                class="flex items-center gap-2 bg-green-50 border border-green-200 rounded-md p-4"
              >
                <Check class="h-4 w-4 text-green-500" />
                <span class="text-sm text-green-700">
                  Los datos exportados incluyen tratamiento de outliers, imputación de valores
                  faltantes y normalización temporal. Listos para modelado predictivo.
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </AuthenticatedLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { BarChart3, Settings, Loader2, Info, AlertTriangle, Download, Check } from 'lucide-vue-next'

const router = useRouter()

const selectedState = ref('all')
const selectedPeriod = ref('1998-2018')
const analysisProgress = ref(0)
const isAnalyzing = ref(false)
const analysisComplete = ref(false)
const activeTab = ref('statistics')
const tabs = [
  { value: 'statistics', label: 'Estadísticas' },
  { value: 'trends', label: 'Tendencias' },
  { value: 'outliers', label: 'Outliers' },
  { value: 'export', label: 'Exportar' },
]

const states = [
  'Todos los Estados',
  'California',
  'Texas',
  'Florida',
  'New York',
  'Pennsylvania',
  'Illinois',
  'Ohio',
  'Georgia',
  'North Carolina',
  'Michigan',
]

const datasetStats = {
  totalRecords: '1,234,567',
  states: '50',
  years: '21',
  missingValues: '2.3%',
  outliers: '156',
  dataQuality: '97.7%',
}

const analysisResults = {
  trends: [
    { metric: 'Crecimiento Anual Promedio', value: '2.4%', status: 'normal' },
    { metric: 'Variabilidad Estacional', value: '15.3%', status: 'high' },
    { metric: 'Correlación Temporal', value: '0.89', status: 'strong' },
  ],
  outliers: [
    {
      state: 'California',
      year: '2001',
      value: 'Pico energético +340%',
      reason: 'Crisis energética',
    },
    { state: 'Texas', year: '2011', value: 'Caída -45%', reason: 'Evento climático extremo' },
    { state: 'New York', year: '2012', value: 'Pico +180%', reason: 'Huracán Sandy' },
  ],
}

function goToVisualizations() {
  router.push('/visualizations')
}

function handleAnalysis() {
  isAnalyzing.value = true
  analysisProgress.value = 0
  analysisComplete.value = false
  activeTab.value = 'statistics'
  const interval = setInterval(() => {
    if (analysisProgress.value >= 100) {
      clearInterval(interval)
      isAnalyzing.value = false
      analysisComplete.value = true
      return
    }
    analysisProgress.value += 10
  }, 500)
}

function badgeClass(status: string) {
  if (status === 'normal') return 'inline-block px-2 py-1 rounded bg-gray-200 text-gray-700 text-xs'
  if (status === 'high') return 'inline-block px-2 py-1 rounded bg-red-200 text-red-700 text-xs'
  return 'inline-block px-2 py-1 rounded bg-blue-200 text-blue-700 text-xs'
}

onMounted(() => {
  const token = localStorage.getItem('auth_token')
  if (!token) {
    router.push('/login')
  }
})
</script>

<style scoped>
/* Add any additional custom styles if needed */
</style>
