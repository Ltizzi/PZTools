# Novedades y Traducciones

## 👥 Cuentas Independientes (Usuarios/Grupos)

### Sistema de Cuentas

Cada cuenta representa a un **jugador o grupo** y es **completamente independiente**:
- **Items separados por cuenta**: Lo que marca un usuario no afecta a otros
- **Ideal para**:
  - Servidores dedicados con múltiples jugadores
  - Grupos de amigos que juegan juntos
  - Diferentes saves del mismo servidor
- **Nombre flexible**: Usa tu nombre de jugador o un nombre para tu grupo (ej: "Equipo Alpha", "Los Sobrevivientes")

### Flujo de Trabajo

1. **Registro**: Crea una cuenta para tu grupo o jugador
2. **Tracking**: Marca los items que has recolectado
3. **Independencia**: Cada usuario/grupo mantiene su propio progreso
4. **Admin Dashboard**: El admin puede ver todos los usuarios y su progreso individual

## 🔐 Panel de Administración

### Login de Admin

El sistema incluye una cuenta de administrador con acceso al dashboard:
- **Usuario**: `admin`
- **Contraseña**: `12345` (por defecto)
- **Cambio de contraseña**: Disponible dentro del panel

### Dashboard de Administrador

El panel de admin incluye:

#### 📊 Estadísticas del Servidor
- Número total de usuarios/grupos registrados
- Total de items disponibles en la base de datos
- Total de registros de progreso almacenados
- Porcentaje de espacio utilizado en la base de datos

#### 💾 Espacio en Vercel (Estimado)
- Barra de progreso visual del espacio usado
- Estimación basada en usuarios y registros
- Límite del plan gratis: 100 MB
- Indicador de advertencia cuando supera el 80%

**Nota**: Esta es una estimación ya que Vercel no ofrece una API pública para obtener el espacio real. El cálculo se basa en:
- ~0.1 KB por usuario
- ~0.05 KB por registro de progreso

#### 👥 Lista de Usuarios Registrados
Tabla con información de cada usuario:
- ID del usuario
- Nombre de usuario/grupo
- Fecha de registro
- Cantidad de items recolectados

#### 🔐 Cambio de Contraseña Admin

Proceso seguro para cambiar la contraseña:
1. Ingresar la contraseña actual
2. Ingresar la nueva contraseña (mínimo 4 caracteres)
3. Confirmar la nueva contraseña
4. Click en "Cambiar Contraseña"

**Validaciones**:
- La contraseña actual debe ser correcta
- La nueva contraseña debe tener al menos 4 caracteres
- Las contraseñas nuevas deben coincidir

### Navegación del Panel

El botón **⚙️ Panel Admin** permite alternar entre:
- **📦 Items**: Vista normal de tracking de items
- **⚙️ Panel Admin**: Dashboard de administración

## 🆕 Novedades en la UI

### 3 Vistas Disponibles

1. **🎴 Vista de Tarjetas**
   - Información completa de cada item
   - Categoría, icono, nombre y skill
   - Ideal para explorar items en detalle

2. **🎨 Vista de Iconos**
   - Vista compacta con iconos
   - Nombre del item debajo del icono
   - Perfecta para escanear rápidamente
   - Hasta 10 iconos por fila en pantallas grandes

3. **📋 Vista de Lista**
   - Vista tradicional tipo tabla
   - Icono, nombre, categoría y skill en una fila
   - Ideal para navegar muchos items de forma eficiente

### 📚 Navegación de Colecciones

Cuando seleccionas un libro que es parte de una colección (ej: "Cocina Vol. 3"), aparece una **barra de navegación** con:

- Todos los volúmenes de la colección
- Indicador visual de cuáles ya tienes (✓)
- Click para saltar al item específico
- Scroll horizontal para colecciones largas

**Ejemplo**: Si seleccionas "Mecánica Vol. 2", verás:
```
📚 Colección: Mecánica
[ ○ Mecánica Vol. 1 ] [ ✓ Mecánica Vol. 2 ] [ ○ Mecánica Vol. 3 ]
```

### 🎨 Iconos por Tipo

| Tipo | Icono |
|------|-------|
| Libro de Habilidad | 📚 |
| Revista de Recetas | 📖 |
| Cinta VHS | 📼 |
| Otros | 📄 |

## 🌐 Traducciones

### Skills al Español

| Inglés | Español |
|--------|---------|
| Agriculture | Agricultura |
| Cooking | Cocina |
| Doctor | Medicina |
| Electricity | Electricidad |
| Fishing | Pesca |
| Foraging | Forrajeo |
| Mechanics | Mecánica |
| Metalworking | Metalurgia |
| Sprinting | Correr |
| SmallBlade | Armas Cortas |
| Blunt | Contundentes |
| Axe | Hacha |
| LongBlade | Espadas Largas |
| SmallBlunt | Armas Pequeñas |
| Fitness | Condición Física |
| Tailoring | Costura |
| Trapping | Trampas |
| Passing | Pases |
| Carpentry | Carpintería |
| Glassworking | Vidrio |
| Combat | Combate |
| Tricks | Trucos |

### Categorías al Español

| Inglés | Español |
|--------|---------|
| Skill Book | Libro de Habilidad |
| Recipe Magazine | Revista de Recetas |
| VHS Tape | Cinta VHS |

### Ejemplos de Nombres Traducidos

| Inglés | Español |
|--------|---------|
| Agriculture Vol. 1 | Agricultura Vol. 1 |
| Cooking Vol. 3 | Cocina Vol. 3 |
| Electrician Vol. 5 | Electricidad Vol. 5 |
| Fishing Vol. 2 | Pesca Vol. 2 |
| Mechanics Vol. 1 | Mecánica Vol. 1 |
| Small Blade Vol. 4 | Armas Cortas Vol. 4 |
| Blunt Vol. 3 | Contundentes Vol. 3 |
| Axe Vol. 2 | Hacha Vol. 2 |
| Tailoring Vol. 1 | Costura Vol. 1 |
| Trapping Vol. 5 | Trampas Vol. 5 |
| Fitness Vol. 4 | Condición Física Vol. 4 |
| Home VHS - Exercise | VHS Hogar - Ejercicio |
| Home VHS - Carpentry | VHS Hogar - Carpintería |
| Home VHS - Cooking | VHS Hogar - Cocina |
| Home VHS - Farming | VHS Hogar - Agricultura |
| Home VHS - Fishing | VHS Hogar - Pesca |
| Home VHS - Medical | VHS Hogar - Medicina |

## 💡 Tips de Uso

1. **Para coleccionar series**: Usa la vista de iconos para ver todos los volúmenes de una skill a la vez
2. **Para revisar progreso**: La vista de lista muestra más items por pantalla
3. **Para explorar**: La vista de tarjetas muestra todos los detalles
4. **El buscador acepta términos en español y en inglés**
5. **La vista seleccionada se guarda automáticamente** para tu próxima visita
6. **Haz clic en un chip de la colección** para saltar directamente a ese item

## 📊 Colecciones Detectadas

El sistema detecta automáticamente cuando un item es parte de una colección y muestra la navegación. Las colecciones más comunes incluyen:

- **Habilidad (Skill Books)**: Vol. 1-5 de cada skill (ej: Cocina, Mecánica, Agricultura)
- **Mecánica**: 3 volúmenes de revistas
- **Electricidad**: 10+ volúmenes de revistas
- **Metalurgia**: 15+ volúmenes de revistas
- **Costura**: 12 volúmenes de revistas
- **Combat**: 14 volúmenes de revistas

## 📺 VHS Completo (~130 items)

### Categorías de VHS

#### 📼 VHS Hogar (Skill Related) - 6 items
Cintas de hogar que dan XP en skills:
- Ejercicio (Fitness)
- Carpintería (Carpintería)
- Cocina (Cocina)
- Agricultura (Agricultura)
- Pesca (Pesca)
- Medicina (Medicina)

#### 🎬 VHS Películas (No Skill Related) - ~30 items
Películas que solo reducen el aburrimiento:
- Breaking Points, Man on the Run, Pleistocene Land, Eagle Down
- Home Invaders 2, Blood in the Hood, Lives Taken, Sordid Client
- Dime Diamonds, Satin and Silk, Three Deaths and a Divorce
- Train Bomb, You Are Dead, War Front, All Over Again
- CyberKiller 2, Strange Little Men, Operation Fort Knox
- Dying Strike, Marriage License, The Crying of Foxes, Cosa Nostra
- The Danger in Your Bed, Loveheart, Squad Down, Return of Nightwatcher
- Fred and Ali's Radical Journey, The Janitor, Survival Instinct, Global Warrior
- The Dog Goblin (I, II, III, IV) - Serie de 4 películas
- Ghoul Stoppers, Slow Descent, Dark Agent, Timeberg Manor
- Ace Pilot, Tired in Toronto, Dead Wrong (Aiming XP), Mother's Boy (Short Blade XP)
- Tangier, Molly Brown, Paris in the Rain

**Indicador**: ❌ -no skill related-

#### 📺 VHS Programas TV (No Skill Related) - ~90 items
Series completas de TV con múltiples episodios:

**Series con 5 episodios cada una:**
- Washington High S5 (5 episodios)
- Strange True S2 (5 episodios)
- Ballincoolin S1 (5 episodios)
- Space Crew S3 (5 episodios)
- The Moderators S2 (5 episodios)

**Series con 10 episodios:**
- The Magical Woodland (E1-E5)
- The Omega Department (10 episodios: S3 E1-E5 y S5 E1-E5)
- Albert Wellen QC (5 episodios)
- Z-Squad (5 episodios, episodio 3 da XP de Mechanics)
- The Thompsons S3 (5 episodios)
- Dead Wrong S2 (5 episodios)

**Series con 6 episodios:**
- The Cook Show (E1-E6, todos dan XP de Cooking)

**Indicador**: ❌ -no skill related- para todos excepto Cook Show y Z-Squad E3

### Navegación de Colecciones VHS

Cuando seleccionas cualquier item de una serie (ej: "Washington High S5.01" o "Dog Goblin II"), aparece automáticamente la barra de navegación con:
- Todos los episodios de la serie
- Indicadores de cuáles ya tienes (✓)
- Click para saltar al episodio específico
- Resaltado visual al navegar

Las colecciones de VHS funcionan igual que las de libros:
- **Washington High**: 5 episodios
- **Strange True**: 5 episodios
- **Ballincoolin**: 5 episodios
- **Space Crew**: 5 episodios
- **The Moderators**: 5 episodios
- **The Magical Woodland**: 5 episodios
- **The Omega Department**: 10 episodios
- **Albert Wellen QC**: 5 episodios
- **Z-Squad**: 5 episodios
- **The Thompsons**: 5 episodios
- **Dead Wrong**: 5 episodios
- **The Cook Show**: 6 episodios
- **The Dog Goblin**: 4 películas

### Indicador Visual

Los items que NO están relacionados con skills tienen el indicador:
```
❌ -no skill related-
```

Este indicador aparece en:
- Vista de tarjetas (debajo del icono)
- Vista de iconos (debajo del nombre)
- Vista de lista (al lado del nombre, naranja)

Los items que SÍ dan XP NO tienen este indicador.

## 🎯 Feedback Visual

- ✅ Item recolectado (fondo verde)
- ⬜ Item pendiente (fondo gris)
- ✓ Indicador en chips de colección
- ○ Indicador de item pendiente en colección
- 🔍 Resaltado momentáneo al navegar desde colección

## 📱 Responsive

La app se adapta automáticamente a tu dispositivo:

### Tamaños de Fuente
- **Móvil**: Texto más pequeño (text-xs, text-sm)
- **Tablet/Desktop**: Texto normal (text-base, text-lg)

### Grid de Iconos
- **Móvil**: 3 iconos por fila
- **Tablet**: 4-6 iconos por fila
- **Desktop**: 8-10 iconos por fila

### Grid de Tarjetas
- **Móvil**: 1 tarjeta por fila
- **Tablet**: 2 tarjetas por fila
- **Desktop**: 3-4 tarjetas por fila

### Layout Adaptativo
- **Header**: Columna en móvil, fila en desktop
- **Botones**: Texto más pequeño en móvil
- **Inputs**: Espaciado optimizado para toque en móvil
- **Tablas**: Scroll horizontal en móviles
- **Barras de colección**: Scroll horizontal con indicadores táctiles

### Optimizaciones Móviles
- Touch-friendly (tamaño mínimo 44px para elementos interactivos)
- Scroll suave en listas
- Padding reducido para maximizar espacio
- Iconos más grandes para mejor legibilidad