#!/bin/bash

echo "=== PZ Loot Tracker - Script de Instalación ==="
echo ""

echo "1. Instalando dependencias..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Error al instalar dependencias"
    exit 1
fi

echo "✅ Dependencias instaladas correctamente"
echo ""

echo "2. El proyecto está listo para usar"
echo ""
echo "Para iniciar el servidor localmente:"
echo "   npm start"
echo ""
echo "Luego abre tu navegador en: http://localhost:3000"
echo ""
echo "Para hacer deploy en Vercel, consulta el archivo DEPLOY.md"