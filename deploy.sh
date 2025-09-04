#!/bin/bash

echo "🚀 Iniciando despliegue de SlackTime en Vercel..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para mostrar mensajes
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar que estemos en el directorio correcto
if [ ! -f "package.json" ]; then
    print_error "No se encontró package.json. Asegúrate de estar en el directorio raíz del proyecto."
    exit 1
fi

print_status "Verificando estructura del proyecto..."

# Verificar que existan los directorios necesarios
if [ ! -d "FrontSlack" ] || [ ! -d "BackSlack" ]; then
    print_error "No se encontraron los directorios FrontSlack o BackSlack."
    exit 1
fi

# Verificar que existan los archivos de configuración de Vercel
if [ ! -f "FrontSlack/vercel.json" ] || [ ! -f "BackSlack/vercel.json" ]; then
    print_error "No se encontraron los archivos de configuración de Vercel."
    print_warning "Ejecuta primero la preparación del proyecto."
    exit 1
fi

print_status "Estructura del proyecto verificada correctamente."

# Paso 1: Preparar Backend
print_status "Preparando Backend..."
cd BackSlack

if ! npm install; then
    print_error "Error al instalar dependencias del backend."
    exit 1
fi

print_status "Backend preparado correctamente."
cd ..

# Paso 2: Preparar Frontend
print_status "Preparando Frontend..."
cd FrontSlack

if ! npm install; then
    print_error "Error al instalar dependencias del frontend."
    exit 1
fi

if ! npm run build; then
    print_error "Error al construir el frontend."
    exit 1
fi

print_status "Frontend preparado correctamente."
cd ..

# Paso 3: Verificar build
print_status "Verificando builds..."

if [ ! -d "FrontSlack/dist/FrontSlack" ]; then
    print_error "No se encontró el directorio de build del frontend."
    exit 1
fi

print_status "Builds verificados correctamente."

# Paso 4: Instrucciones de despliegue
echo ""
echo "🎉 ¡Proyecto preparado exitosamente para Vercel!"
echo ""
echo "📋 Próximos pasos para el despliegue:"
echo ""
echo "1. 🌐 Ve a: https://vercel.com/andreas-projects-894ffd57"
echo "2. 📦 Haz click en 'New Project'"
echo "3. 🔗 Importa tu repositorio de GitHub"
echo "4. ⚙️  Configura las variables de entorno:"
echo ""
echo "   Para el BACKEND:"
echo "   - TENANT_ID=tu_tenant_id_de_azure"
echo "   - CLIENT_ID=tu_client_id_de_azure"
echo "   - CLIENT_SECRET=tu_client_secret_de_azure"
echo "   - TIMEZONE=America/Bogota"
echo "   - NODE_ENV=production"
echo ""
echo "   Para el FRONTEND:"
echo "   - API_URL=https://slacktime-backend.vercel.app"
echo "   - NODE_ENV=production"
echo ""
echo "5. 🚀 Haz click en 'Deploy'"
echo ""
echo "📚 Consulta DEPLOYMENT.md para instrucciones detalladas."
echo ""
echo "🔍 URLs esperadas después del despliegue:"
echo "   Frontend: https://slacktime-frontend.vercel.app"
echo "   Backend:  https://slacktime-backend.vercel.app"
echo ""
