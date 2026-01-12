import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import Menu from './src/components/Menu.vue'
import Calendar from './src/components/Calendar.vue'
import Tracker from './src/components/Tracker.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: Menu },
    { path: '/tracker', component: Tracker },
    { path: '/calendar', component: Calendar }
  ]
})

const app = createApp(App)
app.use(router)
app.mount('#app')