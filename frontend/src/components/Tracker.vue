<script>
import { useRouter } from 'vue-router'

const translations = {
  skill: {
    'Agriculture': 'Agricultura', 'Cooking': 'Cocina', 'Doctor': 'Medicina', 'Electricity': 'Electricidad', 'Farming': 'Agricultura', 'Fishing': 'Pesca', 'Foraging': 'Forrajeo', 'Mechanics': 'Mecánica', 'Metalworking': 'Metalurgia', 'Sprinting': 'Correr', 'SmallBlade': 'Armas Cortas', 'Blunt': 'Contundentes', 'Axe': 'Hacha', 'LongBlade': 'Espadas Largas', 'SmallBlunt': 'Armas Pequeñas', 'Fitness': 'Condición Física', 'Tailoring': 'Costura', 'Trapping': 'Trampas', 'Passing': 'Pases', 'Carpentry': 'Carpintería', 'Glassworking': 'Vidrio'
  },
  category: {
    'Skill Book': 'Libro de Habilidad', 'Recipe Magazine': 'Revista de Recetas', 'VHS Movie': 'VHS Película', 'VHS TV Show': 'VHS Programa TV', 'VHS Home': 'VHS Hogar'
  }
}

export default {
  name: 'Tracker',
  data() {
    return {
      user: null,
      token: localStorage.getItem('pz_token'),
      authForm: { username: '', password: '' },
      loading: false,
      error: '',
      items: [],
      categories: [],
      search: '',
      selectedCategory: '',
      stats: null,
      currentView: 'cards',
      selectedFilter: 'all',
      filterOptions: [
        { id: 'all', name: 'Todos', icon: '📋' },
        { id: 'collected', name: 'Recolectados', icon: '✅' },
        { id: 'missing', name: 'Faltantes', icon: '⬜' }
      ],
      viewModes: [
        { id: 'cards', name: 'Tarjetas', icon: '🎴' },
        { id: 'icons', name: 'Iconos', icon: '🎨' },
        { id: 'list', name: 'Lista', icon: '📋' }
      ]
    }
  },
  computed: {
    filteredItems() {
      let result = this.items.map(item => ({ ...item, displayName: this.translateItemName(item.name) }))
      if (this.search) {
        const searchLower = this.search.toLowerCase()
        result = result.filter(item => 
          item.displayName.toLowerCase().includes(searchLower) ||
          item.skill?.toLowerCase().includes(searchLower) ||
          item.category.toLowerCase().includes(searchLower) ||
          item.base_id.toLowerCase().includes(searchLower)
        )
      }
      if (this.selectedCategory) {
        result = result.filter(item => item.category === this.selectedCategory)
      }
      return result
    }
  },
  watch: {
    currentView(newView) {
      localStorage.setItem('pz_view_mode', newView)
    },
    selectedFilter() {
      this.loadItems()
    },
    selectedCategory() {
      this.loadItems()
    }
  },
  mounted() {
    const savedView = localStorage.getItem('pz_view_mode')
    if (savedView) this.currentView = savedView
    if (this.token) this.loadUser()
  },
  methods: {
    getItemIcon(category) {
      const icons = {
        'Skill Book': '📚',
        'Recipe Magazine': '📖',
        'VHS Movie': '🎬',
        'VHS TV Show': '📺',
        'VHS Home': '📼',
        'Comic/Paper': '📄'
      }
      return icons[category] || '📚'
    },
    translateCategory(category) {
      return translations.category[category] || category
    },
    translateSkill(skill) {
      return translations.skill[skill] || skill
    },
    translateItemName(name) {
      return name.replace(/Vol.?/g, 'Vol.')
        .replace(/Agriculture/g, 'Agricultura')
        .replace(/Cooking/g, 'Cocina')
        .replace(/Doctor/g, 'Medicina')
        .replace(/Electricity/g, 'Electricidad')
        .replace(/Electrician/g, 'Electricidad')
        .replace(/Fishing/g, 'Pesca')
        .replace(/Foraging/g, 'Forrajeo')
        .replace(/Mechanics/g, 'Mecánica')
        .replace(/Metalworking/g, 'Metalurgia')
        .replace(/Sprinting/g, 'Correr')
        .replace(/Small Blade/g, 'Armas Cortas')
        .replace(/SmallBlade/g, 'Armas Cortas')
        .replace(/Blunt/g, 'Contundentes')
        .replace(/Axe/g, 'Hacha')
        .replace(/Long Blade/g, 'Espadas Largas')
        .replace(/LongBlade/g, 'Espadas Largas')
        .replace(/Small Blunt/g, 'Armas Pequeñas')
        .replace(/SmallBlunt/g, 'Armas Pequeñas')
        .replace(/Fitness/g, 'Condición Física')
        .replace(/Tailoring/g, 'Costura')
        .replace(/Trapping/g, 'Trampas')
        .replace(/Passing/g, 'Pases')
        .replace(/Carpentry/g, 'Carpintería')
        .replace(/Carpentary/g, 'Carpintería')
        .replace(/Glassmaking/g, 'Vidrio')
        .replace(/Glassworking/g, 'Vidrio')
        .replace(/Home VHS/g, 'VHS Hogar')
    },
    async login() {
      if (!this.authForm.username || !this.authForm.password) {
        this.error = 'Completa todos los campos'
        return
      }
      this.loading = true
      this.error = ''
      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.authForm)
        })
        const data = await response.json()
        if (response.ok) {
          this.token = data.token
          this.user = data.user
          localStorage.setItem('pz_token', this.token)
          this.loadItems()
          this.loadStats()
        } else {
          await this.register()
        }
      } catch (err) {
        this.error = 'Error de conexión'
      } finally {
        this.loading = false
      }
    },
    async register() {
      try {
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.authForm)
        })
        const data = await response.json()
        if (response.ok) {
          this.token = data.token
          this.user = data.user
          localStorage.setItem('pz_token', this.token)
          this.loadItems()
          this.loadStats()
        } else {
          this.error = data.error || 'Error al registrar'
        }
      } catch (err) {
        this.error = 'Error de conexión'
      }
    },
    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('pz_token')
      localStorage.removeItem('pz_view_mode')
      this.authForm = { username: '', password: '' }
      this.items = []
      this.stats = null
    },
    async loadUser() {
      try {
        const response = await fetch('/api/items', {
          headers: { 'Authorization': `Bearer ${this.token}` }
        })
        if (response.ok) {
          const items = await response.json()
          this.items = items
          this.categories = [...new Set(items.map(i => i.category))]
          const userPayload = JSON.parse(atob(this.token.split('.')[1]))
          this.user = { ...userPayload }
          this.loadStats()
        } else {
          this.logout()
        }
      } catch (err) {
        this.logout()
      }
    },
    async loadItems() {
      try {
        const params = new URLSearchParams()
        if (this.selectedCategory) params.append('category', this.selectedCategory)
        if (this.search) params.append('search', this.search)
        if (this.selectedFilter !== 'all') params.append('filter', this.selectedFilter)
        
        const response = await fetch('/api/items?' + params.toString(), {
          headers: { 'Authorization': `Bearer ${this.token}` }
        })
        if (response.ok) {
          this.items = await response.json()
          this.categories = [...new Set(this.items.map(i => i.category))]
        }
      } catch (err) {
        console.error('Error loading items:', err)
      }
    },
    async loadStats() {
      try {
        const response = await fetch('/api/stats', {
          headers: { 'Authorization': `Bearer ${this.token}` }
        })
        if (response.ok) {
          const stats = await response.json()
          this.stats = {
            collected: stats.collectedItems,
            total: stats.totalItems,
            percentage: stats.progress
          }
        }
      } catch (err) {
        console.error('Error loading stats:', err)
      }
    },
    async toggleItem(item) {
      try {
        const response = await fetch('/api/toggle-item', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.token}` },
          body: JSON.stringify({ itemId: item.id })
        })
        if (response.ok) {
          item.collected = !item.collected
          this.loadStats()
        }
      } catch (err) {
        console.error('Error toggling item:', err)
      }
    },
    async exportTracker() {
      try {
        const response = await fetch('/api/export-tracker', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${this.token}` }
        })
        if (response.ok) {
          const data = await response.json()
          const exportItems = data.items || []
          const blob = new Blob([JSON.stringify({ items: exportItems }, null, 2)], { type: 'application/json' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = 'pz-tracker-export.json'
          a.click()
          URL.revokeObjectURL(url)
        }
      } catch (err) {
        console.error('Error exporting tracker:', err)
      }
    },
    async importTracker(event) {
      const file = event.target.files[0]
      if (!file) return
      
      try {
        const text = await file.text()
        const data = JSON.parse(text)
        const items = data.items || data
        
        if (!Array.isArray(items)) {
          alert('Archivo de importación inválido')
          return
        }
        
        const response = await fetch('/api/import-tracker', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.token}` },
          body: JSON.stringify({ items })
        })
        
        if (response.ok) {
          const result = await response.json()
          alert(result.message)
          this.loadItems()
          this.loadStats()
        } else {
          const error = await response.json()
          alert(error.error || 'Error al importar')
        }
      } catch (err) {
        console.error('Error importing tracker:', err)
        alert('Error al leer el archivo')
      }
      event.target.value = ''
    }
  }
}
</script>

<template>
  <div v-if="!user" class="min-h-screen flex items-center justify-center p-4">
    <div class="bg-gray-800 rounded-lg p-6 sm:p-8 w-full max-w-md shadow-2xl border border-gray-700">
      <h1 class="text-2xl sm:text-3xl font-bold text-center mb-2 text-red-500">📚 PZ Loot Tracker</h1>
      <p class="text-center text-gray-400 mb-6">Rastreador de Literatura de Project Zomboid</p>
      <div>
        <label class="block text-sm font-medium mb-2">Nombre de Usuario/Grupo</label>
        <input v-model="authForm.username" type="text" class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500" placeholder="Nombre de tu jugador o grupo" @keyup.enter="login" />
        <p class="text-xs text-gray-500 mt-1">Cada cuenta representa a un jugador o grupo independiente</p>
      </div>
      <div>
        <label class="block text-sm font-medium mb-2">Contraseña</label>
        <input v-model="authForm.password" type="password" class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500" placeholder="Tu contraseña (mínimo 4 caracteres)" @keyup.enter="login" />
      </div>
      <button @click="login" :disabled="loading" class="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-bold py-3 rounded-lg transition">{{ loading ? 'Cargando...' : 'Iniciar Sesión' }}</button>
      <p v-if="error" class="text-red-400 text-center text-sm">{{ error }}</p>
      <p class="text-center text-gray-500 text-sm mt-2">¿No tienes cuenta? Se creará automáticamente si el usuario no existe</p>
    </div>
  </div>
  
  <div v-else class="container mx-auto px-4 py-6 max-w-7xl">
    <header class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div class="flex items-center gap-3 mb-2">
        <button @click="$router.push('/')" class="back-btn px-4 py-2 rounded-lg text-gray-300 hover:text-white transition">← Menú</button>
        <h1 class="zomboid-title text-xl md:text-2xl text-red-500">📚 PZ TRACKER</h1>
      </div>
      <p class="text-gray-400 text-sm sm:text-base">Cuenta: {{ user.username }}</p>
      <div class="flex gap-2">
        <input type="file" id="importFile" accept=".json" class="hidden" @change="importTracker" />
        <button @click="exportTracker" class="bg-green-700 hover:bg-green-600 px-3 py-2 rounded-lg transition text-sm" title="Exportar progreso">💾 Exportar</button>
        <label for="importFile" class="bg-blue-700 hover:bg-blue-600 px-3 py-2 rounded-lg transition text-sm cursor-pointer" title="Importar progreso">📂 Importar</label>
        <button @click="logout" class="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg transition text-sm">Cerrar Sesión</button>
      </div>
    </header>
    
    <div v-if="stats" class="bg-gray-800 rounded-lg p-4 sm:p-6 mb-6 border border-gray-700">
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-center">
        <div>
          <p class="text-2xl sm:text-3xl font-bold text-red-500">{{ stats.collected }}</p>
          <p class="text-gray-400 text-xs sm:text-sm">Items Recolectados</p>
        </div>
        <div>
          <p class="text-2xl sm:text-3xl font-bold text-gray-300">{{ stats.total - stats.collected }}</p>
          <p class="text-gray-400 text-xs sm:text-sm">Faltantes</p>
        </div>
        <div>
          <p class="text-2xl sm:text-3xl font-bold text-green-500">{{ stats.percentage }}%</p>
          <p class="text-gray-400 text-xs sm:text-sm">Completado</p>
        </div>
        <div>
          <div class="w-full bg-gray-700 rounded-full h-3 sm:h-4 mt-1 sm:mt-2">
            <div class="bg-gradient-to-r from-red-600 to-red-500 h-3 sm:h-4 rounded-full transition-all duration-500" :style="{ width: stats.percentage + '%' }"></div>
          </div>
          <p class="text-gray-400 text-xs sm:text-sm mt-1">Progreso Global</p>
        </div>
      </div>
    </div>
    
    <div class="mb-6 space-y-4">
      <div class="flex flex-col sm:flex-row gap-3">
        <div class="flex-1">
          <input v-model="search" type="text" class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 text-base" placeholder="🔍 Buscar item (ej: Cocina, Mecánica, Hacha...)" />
        </div>
        <select v-model="selectedCategory" class="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 text-base">
          <option value="">Todas las categorías</option>
          <option v-for="cat in categories" :key="cat" :value="cat">{{ translateCategory(cat) }}</option>
        </select>
      </div>
      <div class="flex gap-2 overflow-x-auto pb-2">
        <button v-for="filter in filterOptions" :key="filter.id" @click="selectedFilter = filter.id" class="px-3 sm:px-4 py-2 rounded-lg transition whitespace-nowrap text-sm" :class="selectedFilter === filter.id ? 'bg-red-600 text-white' : 'bg-gray-700 hover:bg-gray-600'" :title="filter.name">{{ filter.icon }} {{ filter.name }}</button>
      </div>
      <div class="flex gap-2 overflow-x-auto pb-2">
        <button v-for="view in viewModes" :key="view.id" @click="currentView = view.id" class="px-3 sm:px-4 py-2 rounded-lg transition whitespace-nowrap text-sm" :class="currentView === view.id ? 'bg-red-600 text-white' : 'bg-gray-700 hover:bg-gray-600'">{{ view.icon }} {{ view.name }}</button>
      </div>
    </div>
    
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
    </div>
    
    <div v-else-if="filteredItems.length === 0" class="text-center py-12 text-gray-500">
      <p class="text-xl">No se encontraron items</p>
      <p class="text-sm mt-2">Intenta con otro término de búsqueda</p>
    </div>
    
    <div v-else-if="currentView === 'cards'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
       <div v-for="item in filteredItems" :key="item.id" :id="'item-' + item.id" class="item-card rounded-lg p-4 cursor-pointer" :class="{ 'collected': item.collected }" @click="toggleItem(item)">
        <div class="flex justify-between items-start mb-2">
          <span class="category-badge text-xs px-2 py-1 rounded bg-gray-700">{{ translateCategory(item.category) }}</span>
          <div class="text-xl sm:text-2xl">{{ item.collected ? '✅' : '⬜' }}</div>
        </div>
        <div class="text-3xl sm:text-4xl mb-2 text-center">{{ getItemIcon(item.category) }}</div>
        <h3 class="font-semibold text-base sm:text-lg mb-1" :class="{ 'line-through opacity-75': item.collected }">{{ item.displayName }}</h3>
        <p v-if="item.skill" class="text-xs sm:text-sm text-gray-400">📚 {{ translateSkill(item.skill) }}</p>
        <div v-if="!item.is_skill_related" class="mt-2 flex items-center gap-2 text-xs text-orange-400">
          <span class="text-base">❌</span>
          <span>-no skill related-</span>
        </div>
        <p class="text-xs text-gray-500 mt-2">ID: {{ item.base_id }}</p>
      </div>
    </div>
    
    <div v-else-if="currentView === 'icons'" class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3 sm:gap-4">
      <div v-for="item in filteredItems" :key="item.id" :id="'item-' + item.id" class="item-card rounded-lg p-2 sm:p-3 cursor-pointer text-center" :class="{ 'collected': item.collected }" @click="toggleItem(item)">
        <div class="text-2xl sm:text-3xl mb-1">{{ getItemIcon(item.category) }}</div>
        <div class="text-xs sm:text-sm font-medium" :class="{ 'line-through opacity-75': item.collected }">{{ item.displayName }}</div>
        <div v-if="!item.is_skill_related" class="text-xs text-orange-400 mt-1">❌ -no skill related-</div>
        <div v-if="item.collected" class="text-xs text-green-300 mt-1">✓</div>
      </div>
    </div>
    
    <div v-else-if="currentView === 'list'" class="rounded-lg overflow-hidden">
      <div v-for="item in filteredItems" :key="item.id" :id="'item-' + item.id" class="list-row flex items-center p-3 sm:p-4 cursor-pointer border-b border-gray-700" :class="{ 'collected': item.collected }" @click="toggleItem(item)">
        <div class="text-xl sm:text-2xl mr-3 sm:mr-4 w-8 sm:w-10 text-center">{{ getItemIcon(item.category) }}</div>
        <div class="flex-1 min-w-0">
          <div class="font-semibold text-sm sm:text-base" :class="{ 'line-through opacity-75': item.collected }">{{ item.displayName }}</div>
          <div class="text-xs sm:text-sm text-gray-400 flex items-center gap-2">
            <span>{{ translateCategory(item.category) }}</span>
            <span v-if="item.skill">•</span>
            <span v-if="item.skill">{{ translateSkill(item.skill) }}</span>
            <span v-if="!item.is_skill_related" class="text-orange-400">• ❌ -no skill related-</span>
          </div>
        </div>
        <div class="text-xl sm:text-2xl ml-3 sm:ml-4">{{ item.collected ? '✅' : '⬜' }}</div>
      </div>
    </div>
  </div>
</template>