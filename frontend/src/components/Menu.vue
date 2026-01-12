<script>
import { useRouter } from 'vue-router'

export default {
  name: 'Menu',
  setup() {
    const router = useRouter()
    return { router }
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="max-w-4xl w-full">
      <div class="text-center mb-12">
        <div class="text-7xl mb-4">🧟</div>
        <h1 class="zomboid-title text-3xl md:text-5xl text-red-600 mb-4">PZ SURVIVAL</h1>
        <h2 class="zomboid-title text-xl md:text-3xl text-orange-500 mb-8">TOOLKIT</h2>
        <p class="text-gray-400 text-sm md:text-base max-w-md mx-auto">Herramientas esenciales para sobrevivir en el apocalipsis zombi</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="card-zomboid rounded-2xl p-8 transition-all duration-300 cursor-pointer" @click="router.push('/tracker')">
          <div class="text-center">
            <div class="text-6xl mb-6">📚</div>
            <h3 class="text-2xl font-bold text-red-400 mb-4">PZ Tracker</h3>
            <p class="text-gray-300 mb-6 text-sm">Rastrea tu progreso de literatura, libros de habilidad, revistas de recetas y cintas VHS de Project Zomboid</p>
            <button class="w-full py-4 px-6 rounded-lg text-white font-bold text-lg bg-gradient-to-r from-red-800 to-red-600 hover:from-red-700 hover:to-red-500 transition">📚 Abrir Tracker</button>
            <div class="mt-4 text-xs text-gray-500"><span class="text-red-400">✓</span> 100+ items <span class="text-red-400 mx-2">✓</span> Cuentas independientes <span class="text-red-400 mx-2">✓</span> 3 vistas</div>
          </div>
        </div>
        <div class="card-zomboid rounded-2xl p-8 transition-all duration-300 cursor-pointer" @click="router.push('/calendar')">
          <div class="text-center">
            <div class="text-6xl mb-6">🌾</div>
            <h3 class="text-2xl font-bold text-green-400 mb-4">Calendario de Cultivos</h3>
            <p class="text-gray-300 mb-6 text-sm">Planifica tu agricultura con el calendario de cultivos optimizado para Build 42 de Project Zomboid</p>
            <button class="w-full py-4 px-6 rounded-lg text-white font-bold text-lg bg-gradient-to-r from-green-800 to-green-600 hover:from-green-700 hover:to-green-500 transition">🌾 Abrir Calendario</button>
            <div class="mt-4 text-xs text-gray-500"><span class="text-green-400">✓</span> 40+ cultivos <span class="text-green-400 mx-2">✓</span> Build 42 <span class="text-green-400 mx-2">✓</span> Meses óptimos</div>
          </div>
        </div>
      </div>
      <div class="text-center mt-12 text-gray-600 text-xs">
        <p>Basado en Project Zomboid Build 42</p>
        <p class="mt-2">Inspirado en el estilo del juego</p>
      </div>
    </div>
  </div>
</template>