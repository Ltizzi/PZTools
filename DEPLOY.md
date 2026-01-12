# Guía de Deploy en Vercel

Esta guía te ayudará a desplegar PZ Loot Tracker en Vercel.

## Opción 1: Deploy desde GitHub (Recomendado)

1. **Subir tu código a GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/tu-usuario/pz-loot-tracker.git
   git push -u origin main
   ```

2. **Conectar a Vercel**
   - Ve a [vercel.com](https://vercel.com) y loguéate
   - Clic en "Add New Project"
   - Importa tu repositorio de GitHub

3. **Configurar el proyecto**
   - Root Directory: `./`
   - Framework Preset: "Other"
   - No necesitas configurar Build Settings porque estamos usando archivos estáticos

4. **Variables de entorno**
   - Agrega una variable llamada `JWT_SECRET`
   - Genera una clave segura: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
   - Pega el resultado como valor

5. **Deploy**
   - Clic en "Deploy"
   - Espera unos minutos y tu app estará en línea

## Opción 2: Deploy con Vercel CLI

1. **Instalar Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   cd pz-loot-tracker
   vercel
   ```

4. **Configurar**
   - Follow the prompts in your terminal
   - Link to your existing project or create a new one
   - Set environment variables when prompted

## Nota sobre la base de datos

Esta app usa una base de datos SQLite en memoria (`:memory:`). Esto significa:
- **Los datos se pierden cuando el servidor se reinicia** (cada deploy o después de un período de inactividad en Vercel)
- Esto es adecuado para desarrollo o uso temporal

### Opciones para persistencia de datos

1. **Para producción**, considera usar:
   - Vercel Postgres
   - Supabase
   - PlanetScale
   - Neon Postgres
   - O cualquier otro servicio de base de datos

2. **Migrar a otra base de datos**:
   - Modifica `backend/server.js` para usar el cliente de tu base de datos elegida
   - Actualiza las queries SQL si es necesario
   - Actualiza `package.json` con las dependencias necesarias

## URL del deploy

Vercel te asignará una URL automática como:
`https://pz-loot-tracker-xxxxx.vercel.app`

Puedes personalizarla en la configuración del proyecto en Vercel.

## Troubleshooting

### Error: "Cannot find module 'sqlite3'"
```bash
cd backend
npm install sqlite3
cd ..
vercel --prod
```

### Error de autenticación
- Verifica que `JWT_SECRET` esté configurado como variable de entorno
- Limpia el localStorage en tu navegador y vuelve a iniciar sesión

### Deploy fallido
- Verifica que todos los archivos están en el repositorio
- Revisa los logs de build en el dashboard de Vercel
- Asegúrate de que `package.json` esté correcto