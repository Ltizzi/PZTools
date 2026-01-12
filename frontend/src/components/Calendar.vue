<script>
import { useRouter } from 'vue-router'

export default {
  name: 'Calendar',
  data() {
    return {
        loading: true,
        error: null,
        selectedMonth: null,
        crops: {},
        searchQuery: '',
        selectedCrop: null,
        showCropModal: false,
        months: [
          { key: 'jan', name: 'Enero', icon: '❄️' },
          { key: 'feb', name: 'Febrero', icon: '🌨️' },
          { key: 'mar', name: 'Marzo', icon: '🌸' },
          { key: 'apr', name: 'Abril', icon: '🌷' },
          { key: 'may', name: 'Mayo', icon: '🌺' },
          { key: 'jun', name: 'Junio', icon: '☀️' },
          { key: 'jul', name: 'Julio', icon: '🔥' },
          { key: 'aug', name: 'Agosto', icon: '🌻' },
          { key: 'sep', name: 'Septiembre', icon: '🍂' },
          { key: 'oct', name: 'Octubre', icon: '🎃' },
          { key: 'nov', name: 'Noviembre', icon: '🍁' },
          { key: 'dec', name: 'Diciembre', icon: '⛄' }
        ]
    }
  },
  computed: {
    filteredCrops() {
      if (!this.selectedMonth || !this.crops) return []
      const searchTerm = this.searchQuery.toLowerCase().trim()
      return Object.entries(this.crops).filter(([key, crop]) => {
        const monthData = crop.months[this.selectedMonth]
        if (!monthData || monthData.status === 'out_of_season') return false
        if (!searchTerm) return true
        return crop.name.toLowerCase().includes(searchTerm) || crop.nameEn.toLowerCase().includes(searchTerm)
      }).map(([key, crop]) => ({ 
        key, 
        name: crop.name, 
        nameEn: crop.nameEn, 
        icon: crop.icon, 
        growthTime: crop.growthTime, 
        calories: crop.calories, 
        status: crop.months[this.selectedMonth].status 
      })).sort((a, b) => {
        const statusPriority = { 'best': 1, 'seasonal': 2, 'worst_in': 3, 'worst_out': 4 }
        return statusPriority[a.status] - statusPriority[b.status]
      })
    }
  },
  mounted() {
    this.fetchCrops()
  },
  methods: {
    async fetchCrops() {
      this.loading = true
      this.error = null
      try {
        const response = await fetch('/api/crops')
        if (!response.ok) throw new Error('Failed to fetch crops')
        this.crops = await response.json()
        const currentMonthIndex = new Date().getMonth()
        const monthKeys = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
        this.selectedMonth = monthKeys[currentMonthIndex]
      } catch (err) {
        this.error = 'Error al cargar los cultivos. Por favor, intenta de nuevo.'
        console.error('Error fetching crops:', err)
      } finally {
        this.loading = false
      }
    },
    selectMonth(monthKey) {
      this.selectedMonth = monthKey
    },
    getMonthName(monthKey) {
      const month = this.months.find(m => m.key === monthKey)
      return month ? month.name : monthKey
    },
    getStatusClass(status) {
      const classes = { 'best': 'status-best', 'seasonal': 'status-seasonal', 'worst_in': 'status-worst-in', 'worst_out': 'status-worst-out' }
      return classes[status] || ''
    },
    getStatusCount(status) {
      return this.filteredCrops.filter(crop => crop.status === status).length
    },
    showCropDetails(cropKey) {
      this.selectedCrop = this.crops[cropKey]
      this.showCropModal = true
    },
    closeCropModal() {
      this.showCropModal = false
      this.selectedCrop = null
    },
    getMonthStatus(monthKey, crop) {
      const monthData = crop.months[monthKey]
      if (!monthData) return 'out_of_season'
      return monthData.status
    },
    getStatusIcon(status) {
      const icons = { 'best': '★', 'seasonal': '●', 'worst_in': '⚠', 'worst_out': '✖', 'out_of_season': '○' }
      return icons[status] || '○'
    },
    getStatusColor(status) {
      const colors = { 'best': 'text-green-400', 'seasonal': 'text-yellow-400', 'worst_in': 'text-orange-400', 'worst_out': 'text-red-400', 'out_of_season': 'text-gray-600' }
      return colors[status] || 'text-gray-600'
    }
  }
}
</script>

<template>
  <div class="container mx-auto px-4 py-6 max-w-6xl">
    <header class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div class="flex-1">
        <div class="flex items-center gap-3 mb-2">
          <button @click="$router.push('/')" class="back-btn px-4 py-2 rounded-lg text-gray-300 hover:text-white transition">← Menú</button>
          <h1 class="zomboid-title text-xl md:text-3xl text-green-500">🌾 CALENDARIO</h1>
        </div>
        <p class="text-gray-400 text-sm mb-3">Selecciona un mes para ver los cultivos recomendados (Build 42)</p>
        <input v-model="searchQuery" type="text" placeholder="🔍 Buscar cultivo por nombre..." class="search-input w-full px-4 py-3 rounded-lg text-sm bg-gray-800 border border-gray-700 text-white" :disabled="!selectedMonth" />
        <div v-if="searchQuery && selectedMonth" class="text-xs text-gray-500 mt-1">
          Filtrando: <span class="text-green-400">{{ searchQuery }}</span> ({{ filteredCrops.length }} resultado{{ filteredCrops.length !== 1 ? 's' : '' }})
        </div>
      </div>
      <div class="text-right">
        <div class="text-sm text-gray-400">
          <span class="text-green-400">★</span> Mejor <span class="text-yellow-400 ml-2">●</span> Temporada <span class="text-orange-400 ml-2">⚠</span> Peor (dentro) <span class="text-red-400 ml-2">✖</span> Peor (fuera)
        </div>
      </div>
    </header>
    
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="text-2xl animate-pulse text-green-500">Cargando cultivos...</div>
    </div>
    
    <div v-else-if="error" class="text-center py-20">
      <div class="text-red-500 text-xl mb-4">{{ error }}</div>
      <button @click="fetchCrops" class="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white">Reintentar</button>
    </div>
    
    <div v-else>
      <div class="mb-8">
        <h2 class="text-lg font-bold text-gray-300 mb-4">Selecciona el mes:</h2>
        <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          <button v-for="month in months" :key="month.key" @click="selectMonth(month.key)" class="month-btn px-3 py-4 rounded-lg text-center transition bg-gray-800 border border-gray-700 hover:border-red-500" :class="{ 'bg-red-900 border-red-500': selectedMonth === month.key }">
            <div class="text-2xl mb-1">{{ month.icon }}</div>
            <div class="text-xs font-bold">{{ month.name }}</div>
          </button>
        </div>
      </div>
      
      <div v-if="selectedMonth" class="card-zomboid rounded-xl p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-green-400">📅 {{ getMonthName(selectedMonth) }} - Cultivos recomendados</h2>
          <div class="text-sm text-gray-400">{{ filteredCrops.length }} cultivos encontrados</div>
        </div>
        
        <div v-if="filteredCrops.length === 0" class="text-center py-10">
          <div class="text-4xl mb-4">🌱</div>
          <p class="text-gray-400">No hay cultivos recomendados para este mes</p>
        </div>
        
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="crop in filteredCrops" :key="crop.key" class="crop-card rounded-lg p-4 cursor-pointer hover:scale-105 transition-transform" :class="getStatusClass(crop.status)" @click="showCropDetails(crop.key)">
            <div class="flex items-start gap-3">
              <div class="text-4xl">{{ crop.icon }}</div>
              <div class="flex-1">
                <h3 class="font-bold text-lg mb-1">{{ crop.name }}</h3>
                <p class="text-xs text-gray-400 mb-2">{{ crop.nameEn }}</p>
                <div class="flex flex-wrap gap-2 text-xs">
                  <span class="bg-black/30 px-2 py-1 rounded">⏱️ {{ crop.growthTime }}</span>
                  <span v-if="crop.calories > 0" class="bg-black/30 px-2 py-1 rounded">🔥 {{ crop.calories }} cal</span>
                </div>
              </div>
              <div class="text-2xl">
                <span v-if="crop.status === 'best'" class="text-green-400">★</span>
                <span v-else-if="crop.status === 'seasonal'" class="text-yellow-400">●</span>
                <span v-else-if="crop.status === 'worst_in'" class="text-orange-400">⚠</span>
                <span v-else class="text-red-400">✖</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="selectedMonth" class="mt-6 card-zomboid rounded-xl p-6">
        <h3 class="font-bold text-lg text-orange-400 mb-4">📊 Información del mes</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div class="text-center">
            <div class="text-2xl mb-1">★</div>
            <div class="text-green-400 font-bold">{{ getStatusCount('best') }}</div>
            <div class="text-gray-400">Mejores</div>
          </div>
          <div class="text-center">
            <div class="text-2xl mb-1">●</div>
            <div class="text-yellow-400 font-bold">{{ getStatusCount('seasonal') }}</div>
            <div class="text-gray-400">Temporada</div>
          </div>
          <div class="text-center">
            <div class="text-2xl mb-1">⚠</div>
            <div class="text-orange-400 font-bold">{{ getStatusCount('worst_in') }}</div>
            <div class="text-gray-400">Peor (dentro)</div>
          </div>
          <div class="text-center">
            <div class="text-2xl mb-1">✖</div>
            <div class="text-red-400 font-bold">{{ getStatusCount('worst_out') }}</div>
            <div class="text-gray-400">Peor (fuera)</div>
          </div>
        </div>
      </div>
    </div>
    
    <footer class="mt-8 text-center text-gray-600 text-xs">
      <p>Basado en Build 42 de Project Zomboid</p>
      <p class="mt-1">Los cultivos marcados como "Peor" pueden no crecer correctamente</p>
      <p class="mt-1 text-gray-500">Usa el buscador para encontrar cultivos específicos por nombre</p>
    </footer>

    <!-- Modal de información del cultivo -->
    <div v-if="showCropModal" class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" @click="closeCropModal">
      <div class="card-zomboid rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto" @click.stop>
        <div class="flex justify-between items-start mb-6">
          <div>
            <h2 class="text-2xl font-bold text-green-400 flex items-center gap-3">
              <span class="text-4xl">{{ selectedCrop?.icon }}</span>
              {{ selectedCrop?.name }}
            </h2>
            <p class="text-sm text-gray-400">{{ selectedCrop?.nameEn }}</p>
          </div>
          <button @click="closeCropModal" class="text-gray-400 hover:text-white text-2xl">✕</button>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div class="bg-black/30 rounded-lg p-4 text-center">
            <div class="text-3xl mb-2">⏱️</div>
            <div class="font-bold text-lg">{{ selectedCrop?.growthTime }}</div>
            <div class="text-xs text-gray-400">Tiempo de cultivo</div>
          </div>
          <div class="bg-black/30 rounded-lg p-4 text-center">
            <div class="text-3xl mb-2">🔥</div>
            <div class="font-bold text-lg">{{ selectedCrop?.calories }} cal</div>
            <div class="text-xs text-gray-400">Calorías</div>
          </div>
        </div>

        <h3 class="font-bold text-lg text-orange-400 mb-4">📅 Calendario de cultivo por mes</h3>
        <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          <div v-for="month in months" :key="month.key" 
               class="rounded-lg p-3 text-center transition" 
               :class="getStatusColor(getMonthStatus(month.key, selectedCrop))">
            <div class="text-2xl mb-1">{{ month.icon }}</div>
            <div class="text-xs font-bold mb-1">{{ month.name }}</div>
            <div class="text-lg">{{ getStatusIcon(getMonthStatus(month.key, selectedCrop)) }}</div>
          </div>
        </div>

        <div class="mt-4 pt-4 border-t border-gray-700">
          <div class="text-xs text-gray-400">
            <span class="text-green-400">★</span> Mejor tiempo de cultivo
            <span class="text-yellow-400 ml-3">●</span> Temporada regular
            <span class="text-orange-400 ml-3">⚠</span> Peor tiempo (puede crecer pero con dificultades)
            <span class="text-red-400 ml-3">✖</span> Peor tiempo (probablemente no crezca)
            <span class="text-gray-600 ml-3">○</span> Fuera de temporada
          </div>
        </div>
      </div>
    </div>
  </div>
</template>