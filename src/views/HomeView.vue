<script setup lang="ts">
import TheWelcome from '../components/TheWelcome.vue'
import PublicLayout from '../layouts/PublicLayout.vue'
</script>

<template>
  <PublicLayout>
    <div class="flex flex-col gap-8">
      <!-- Hero Section -->
      <div class="text-center flex flex-col gap-4">
        <h1 class="text-4xl font-bold text-slate-900">
          Sistema de Predicción de Consumo Energético
        </h1>
        <p class="text-xl text-slate-600 max-w-3xl mx-auto">
          Plataforma avanzada para el análisis y predicción del consumo energético utilizando
          inteligencia artificial y machine learning.
        </p>
      </div>

      <!-- Welcome Component -->
      <TheWelcome />

      <!-- Features Section -->
      <div class="grid md:grid-cols-3 gap-8 mt-12">
        <div class="bg-white p-6 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div class="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
            <svg
              class="w-6 h-6 text-unmsm-slate"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-slate-900 mb-2">Análisis Predictivo</h3>
          <p class="text-slate-600">
            Utilizamos algoritmos de machine learning avanzados para predecir patrones de consumo
            energético con alta precisión.
          </p>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div class="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
            <svg
              class="w-6 h-6 text-unmsm-slate"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-slate-900 mb-2">Eficiencia Energética</h3>
          <p class="text-slate-600">
            Optimiza el consumo energético identificando oportunidades de mejora y reduciendo costos
            operativos.
          </p>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div class="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
            <svg
              class="w-6 h-6 text-unmsm-slate"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-slate-900 mb-2">Predicciones Interactivas</h3>
          <p class="text-slate-600">
            Genera predicciones interactivas para una mejor toma de decisiones.
          </p>
        </div>
      </div>
    </div>
  </PublicLayout>
</template>
