<template>
  <div class="min-h-screen bg-slate-50 flex flex-col">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo/Brand -->
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-unmsm-slate rounded-lg flex items-center justify-center shadow-sm">
                <span class="text-white text-sm font-bold">U</span>
              </div>
            </div>
            <div class="ml-3">
              <p class="text-xs text-slate-500 font-medium">Sistema de Predicción</p>
            </div>
          </div>

          <!-- Navigation -->
          <nav class="flex gap-8">
            <router-link
              to="/"
              class="text-slate-700 hover:text-unmsm-slate px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-unmsm-slate bg-slate-100"
            >
              Inicio
            </router-link>
            <router-link
              to="/about"
              class="text-slate-700 hover:text-unmsm-slate px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-unmsm-slate bg-slate-100"
            >
              Acerca de
            </router-link>
            <router-link
              to="/login"
              class="text-slate-700 hover:text-unmsm-slate px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-unmsm-slate bg-slate-100"
            >
              Iniciar Sesión
            </router-link>
          </nav>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <slot />
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-slate-200 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="text-center text-sm text-slate-500">
          <p>&copy; 2025 UNMSM - Universidad Nacional Mayor de San Marcos</p>
          <p class="mt-1">Sistema de Predicción de Consumo Energético.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// No additional logic needed for public layout
</script>

<style scoped>
/* Additional styles if needed */
</style>
