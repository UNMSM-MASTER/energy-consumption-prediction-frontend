<script setup lang="ts">
import PublicLayout from '../layouts/PublicLayout.vue'
</script>

<template>
  <PublicLayout>
    <div class="max-w-4xl mx-auto space-y-8">
      <!-- Header -->
      <div class="text-center space-y-4">
        <h1 class="text-3xl font-bold text-gray-900">Acerca del Sistema</h1>
        <p class="text-lg text-gray-600">
          Conoce más sobre nuestra plataforma de predicción de consumo energético
        </p>
      </div>

      <!-- Mission Section -->
      <div class="bg-white p-8 rounded-lg shadow-sm border">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">Nuestra Misión</h2>
        <p class="text-gray-700 leading-relaxed">
          El Sistema de Predicción de Consumo Energético de OSINERGMIN tiene como objetivo
          proporcionar herramientas avanzadas de análisis y predicción para optimizar el consumo
          energético en las operaciones institucionales. Utilizamos tecnologías de inteligencia
          artificial y machine learning para ofrecer insights valiosos que permitan una gestión más
          eficiente de los recursos energéticos.
        </p>
      </div>

      <!-- Features Grid -->
      <div class="grid md:grid-cols-2 gap-6">
        <div class="bg-white p-6 rounded-lg shadow-sm border">
          <h3 class="text-xl font-semibold text-gray-900 mb-3">Tecnología Avanzada</h3>
          <ul class="space-y-2 text-gray-700">
            <li class="flex items-center">
              <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
              Algoritmos de Machine Learning
            </li>
            <li class="flex items-center">
              <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
              Análisis Predictivo en Tiempo Real
            </li>
            <li class="flex items-center">
              <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
              Visualizaciones Interactivas
            </li>
          </ul>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-sm border">
          <h3 class="text-xl font-semibold text-gray-900 mb-3">Beneficios</h3>
          <ul class="space-y-2 text-gray-700">
            <li class="flex items-center">
              <svg class="w-4 h-4 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
              Reducción de Costos Energéticos
            </li>
            <li class="flex items-center">
              <svg class="w-4 h-4 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
              Mejora en la Eficiencia Operativa
            </li>
            <li class="flex items-center">
              <svg class="w-4 h-4 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
              Toma de Decisiones Basada en Datos
            </li>
          </ul>
        </div>
      </div>

      <!-- Team Section -->
      <div class="bg-white p-8 rounded-lg shadow-sm border">
        <h2 class="text-2xl font-semibold text-gray-900 mb-6">Equipo de Desarrollo</h2>
        <div class="grid md:grid-cols-3 gap-6">
          <div class="text-center">
            <div
              class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3"
            >
              <svg
                class="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <h3 class="font-semibold text-gray-900">Ciencia de Datos</h3>
            <p class="text-sm text-gray-600">Análisis y modelado predictivo</p>
          </div>
          <div class="text-center">
            <div
              class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3"
            >
              <svg
                class="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
            </div>
            <h3 class="font-semibold text-gray-900">Desarrollo</h3>
            <p class="text-sm text-gray-600">Ingeniería de software</p>
          </div>
          <div class="text-center">
            <div
              class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3"
            >
              <svg
                class="w-8 h-8 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
                />
              </svg>
            </div>
            <h3 class="font-semibold text-gray-900">UX/UI</h3>
            <p class="text-sm text-gray-600">Experiencia de usuario</p>
          </div>
        </div>
      </div>

      <!-- Contact Section -->
      <div class="bg-blue-50 p-8 rounded-lg border border-blue-200">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">¿Necesitas Ayuda?</h2>
        <p class="text-gray-700 mb-4">
          Si tienes preguntas sobre el sistema o necesitas soporte técnico, no dudes en
          contactarnos.
        </p>
        <div class="flex flex-col sm:flex-row gap-4">
          <button
            class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Contactar Soporte
          </button>
          <button
            class="border border-blue-600 text-blue-600 px-6 py-2 rounded-md hover:bg-blue-50 transition-colors"
          >
            Documentación
          </button>
        </div>
      </div>
    </div>
  </PublicLayout>
</template>

<style scoped>
/* Additional styles if needed */
</style>
