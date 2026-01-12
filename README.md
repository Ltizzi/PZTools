# PZ Loot Tracker

Web app para rastrear el progreso de literature (skill books, magazines, VHS) en Project Zomboid para servidores dedicados.

## Características

- ✅ Login simple con autenticación JWT
- ✅ **Panel de Administración** con:
  - Lista de usuarios registrados
  - Estadísticas del servidor
  - Estimación de espacio libre en Vercel
  - Cambio de contraseña de admin
- ✅ Base de datos SQLite con 100+ items de literatura
- ✅ Todo traducido al español
- ✅ **3 vistas diferentes**: Tarjetas, Iconos y Lista
- ✅ **Navegación de colecciones**: Barra rápida para libros de una serie (ej: Cocina 1-5)
- ✅ Buscador rápido por nombre, skill o categoría
- ✅ Marcar/desmarcar items con un clic
- ✅ Estadísticas globales y por categoría
- ✅ Iconos visuales por tipo de item (📚 Libros, 📖 Revistas, 📼 VHS)
- ✅ Deploy en Vercel
- ✅ Interfaz responsive (móvil/desktop)

## Items incluidos

### Cuentas Independientes
- **Cada cuenta es un jugador o grupo**
- **Items completamente separados por cuenta**
- **Ideal para servidores dedicados o grupos de amigos**

### Literatura
- **Skill Books** (~100 items): Agricultura, Cocina, Doctor, Electricidad, Pesca, Forrajeo, Mecánica, Metalurgia, Correr, Peleas (varios tipos), Costura, Trampas, etc.
- **Recipe Magazines** (~60 items): Mecánica, Electrónica, Herrería, Metalurgia, Vidrio, Cocina, Agricultura, Pesca, Caza, Costura, Armaduras, Armas

### VHS (~130 items)
**Todos los VHS disponibles en el juego:**

#### VHS Hogar (Skill Related) - 6 items
- Ejercicio (Fitness)
- Carpintería (Carpintería)
- Cocina (Cocina)
- Agricultura (Agricultura)
- Pesca (Pesca)
- Medicina (Medicina)

#### VHS Películas (No Skill Related) - ~30 items
- Breaking Points, Man on the Run, Pleistocene Land, Eagle Down
- Home Invaders 2, Blood in the Hood, Lives Taken, Sordid Client
- Dime Diamonds, Satin and Silk, Three Deaths and a Divorce
- Train Bomb, You Are Dead, War Front, All Over Again
- CyberKiller 2, Strange Little Men, Operation Fort Knox
- Dying Strike, Marriage License, The Crying of Foxes, Cosa Nostra
- The Danger in Your Bed, Loveheart, Squad Down, Return of Nightwatcher
- Fred and Ali Radical Journey, The Janitor, Survival Instinct, Global Warrior
- The Dog Goblin (I, II, III, IV), Ghoul Stoppers, Slow Descent
- Dark Agent, Timeberg Manor, Ace Pilot, Tired in Toronto
- Dead Wrong (Aiming XP), Mother's Boy (Short Blade XP), Tangier, Molly Brown, Paris in the Rain

#### VHS Programas TV (No Skill Related) - ~90 items
**Series completas con múltiples episodios:**
- Washington High S5 (5 episodios)
- Strangely True S2 (5 episodios)
- Ballincoolin S1 (5 episodios)
- Space Crew S3 (5 episodios)
- The Moderators S2 (5 episodios)
- The Magical Woodland (5 episodios: E1-E5)
- The Omega Department (10 episodios: S3 E1-E5 + S5 E1-E5)
- Albert Wellen QC (5 episodios)
- Z-Squad (5 episodios, E3 da XP de Mechanics)
- The Thompsons S3 (5 episodios)
- Dead Wrong S2 (5 episodios)
- The Cook Show (6 episodios, E1-E6, todos dan XP de Cooking)

### Indicadores Visuales
- **❌ -no skill related-**: Items que NO dan experiencia de habilidad
- **✓**: Item recolectado
- **⬜**: Item pendiente

## Instalación local

```bash
# Instalar dependencias
npm install

# Iniciar servidor
npm start
```

La app estará disponible en `http://localhost:3000`

## Deploy en Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

O conecta tu repositorio GitHub a Vercel para deploy automático.

## Variables de entorno

Vercel configurará automáticamente las siguientes variables:
- `PORT`: Puerto del servidor (3000)
- `JWT_SECRET`: Clave secreta para tokens JWT (genera una propia para producción)

## Uso

### Para Usuarios/Grupos

**IMPORTANTE**: Cada cuenta representa a un **jugador o grupo** y sus items son **completamente independientes** de otras cuentas. Esto es ideal para:
- Servidores dedicados con múltiples jugadores
- Grupos de amigos que juegan juntos
- Diferentes saves del mismo servidor

1. Regístrate con un nombre de usuario o grupo (mínimo 4 caracteres)
   - Usa tu nombre de jugador
   - O usa un nombre descriptivo para tu grupo (ej: "Equipo Alpha")
2. **Selecciona la vista**: 🎴 Tarjetas, 🎨 Iconos o 📋 Lista
3. Usa el buscador para encontrar items por nombre, skill o categoría
4. Haz clic en cualquier item para marcarlo como recolectado
5. **Navegación de colecciones**: Cuando seleccionas un libro de una serie (ej: Cocina Vol. 1), aparece una barra con los otros volúmenes para acceso rápido
6. **Indicador ❌ -no skill related-**: Los items que no dan experiencia están marcados con este icono
7. Visualiza tu progreso en las estadísticas

### Para Administradores

1. En la pantalla de login, selecciona **🔐 Admin**
2. Usuario: `admin`
3. Contraseña: `12345` (por defecto)
4. Accederás al **Panel de Administración** con:
   - **📊 Estadísticas del Servidor**: Número de usuarios, items, registros
   - **💾 Espacio en Vercel**: Estimación del espacio usado y disponible
   - **👥 Lista de Usuarios**: Todos los usuarios registrados con sus items recolectados
   - **🔐 Cambiar Contraseña**: Cambia la contraseña del admin

#### Cambio de Contraseña

1. En el panel admin, ve a **🔐 Cambiar Contraseña Admin**
2. Ingresa la **contraseña actual**
3. Ingresa la **nueva contraseña** (mínimo 4 caracteres)
4. **Confirma la nueva contraseña**
5. Haz clic en **Cambiar Contraseña**

### Vistas

- **🎴 Tarjetas**: Vista detallada con información completa de cada item
- **🎨 Iconos**: Vista compacta con iconos y nombres, ideal para escanear rápido
- **📋 Lista**: Vista tradicional con filas, perfecta para navegar muchos items

### Diseño Responsive

La app se adapta automáticamente a cualquier dispositivo:
- **Móvil**: 3-4 iconos por fila, fuentes más pequeñas, layouts optimizados
- **Tablet**: 6-8 iconos por fila, tamaño medio
- **Desktop**: 10 iconos por fila, tamaño completo
- Todas las tablas y listas tienen scroll horizontal en móviles

## Estructura del proyecto

```
pz-loot-tracker/
├── backend/
│   └── server.js          # API Express + SQLite + Admin endpoints
├── frontend/
│   ├── index.html         # App Vue.js (admin + user views)
│   └── dist/
│       └── index.html     # Build para producción
├── vercel.json            # Configuración Vercel
├── package.json
├── README.md
├── FEATURES.md            # Documentación de características
├── DEPLOY.md              # Guía de deploy en Vercel
└── ITEMS.md               # Lista de items con traducciones
```