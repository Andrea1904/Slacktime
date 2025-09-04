# 🚀 Guía de Despliegue en Vercel - SlackTime

## 📋 Prerrequisitos

1. **Cuenta en Vercel**: [https://vercel.com/andreas-projects-894ffd57](https://vercel.com/andreas-projects-894ffd57)
2. **GitHub/GitLab**: Repositorio con el código
3. **Node.js**: Versión 18+ instalada localmente

## 🏗️ Estructura del Proyecto

```
SlackTime/
├── FrontSlack/          # Frontend Angular
│   ├── vercel.json      # Configuración Vercel Frontend
│   └── .vercelignore    # Archivos a excluir
├── BackSlack/           # Backend Node.js
│   ├── vercel.json      # Configuración Vercel Backend
│   └── .vercelignore    # Archivos a excluir
└── DEPLOYMENT.md        # Esta guía
```

## 🚀 Paso 1: Desplegar el Backend

### 1.1 Preparar el Backend
```bash
cd BackSlack
npm install
npm run build
```

### 1.2 Desplegar en Vercel
1. Ve a [Vercel Dashboard](https://vercel.com/andreas-projects-894ffd57)
2. Click en "New Project"
3. Importa tu repositorio de GitHub
4. Configura las variables de entorno:
   ```
   TENANT_ID=tu_tenant_id
   CLIENT_ID=tu_client_id
   CLIENT_SECRET=tu_client_secret
   TIMEZONE=America/Bogota
   NODE_ENV=production
   ```
5. Click en "Deploy"

### 1.3 Verificar el Backend
- URL del backend: `https://slacktime-backend.vercel.app`
- Test endpoint: `https://slacktime-backend.vercel.app/health`

## 🎨 Paso 2: Desplegar el Frontend

### 2.1 Preparar el Frontend
```bash
cd FrontSlack
npm install
npm run build
```

### 2.2 Desplegar en Vercel
1. Ve a [Vercel Dashboard](https://vercel.com/andreas-projects-894ffd57)
2. Click en "New Project"
3. Importa tu repositorio de GitHub
4. Configura las variables de entorno:
   ```
   API_URL=https://slacktime-backend.vercel.app
   NODE_ENV=production
   ```
5. Click en "Deploy"

### 2.3 Verificar el Frontend
- URL del frontend: `https://slacktime-frontend.vercel.app`

## 🔧 Configuración de Variables de Entorno

### Backend (.env en Vercel)
```env
TENANT_ID=tu_tenant_id_de_azure
CLIENT_ID=tu_client_id_de_azure
CLIENT_SECRET=tu_client_secret_de_azure
TIMEZONE=America/Bogota
NODE_ENV=production
FRONTEND_URL=https://slacktime-frontend.vercel.app
```

### Frontend (Variables de entorno en Vercel)
```env
API_URL=https://slacktime-backend.vercel.app
NODE_ENV=production
```

## 📱 URLs Finales

- **Frontend**: `https://slacktime-frontend.vercel.app`
- **Backend**: `https://slacktime-backend.vercel.app`
- **API Health**: `https://slacktime-backend.vercel.app/health`

## 🧪 Verificación del Despliegue

### 1. Verificar Backend
```bash
curl https://slacktime-backend.vercel.app/health
# Debería responder: {"status":"OK","timestamp":"...","version":"1.0.0"}
```

### 2. Verificar Frontend
- Abrir `https://slacktime-frontend.vercel.app`
- Verificar que el formulario se carga correctamente
- Probar la funcionalidad completa

### 3. Verificar Integración
- Seleccionar un grupo en el frontend
- Configurar fechas
- Generar reporte (debería comunicarse con el backend)

## 🐛 Solución de Problemas

### Error de CORS
- Verificar que las URLs del frontend estén en la configuración CORS del backend
- Asegurarse de que las variables de entorno estén configuradas correctamente

### Error de Autenticación
- Verificar que las credenciales de Microsoft Graph API estén correctas
- Asegurarse de que la aplicación tenga los permisos necesarios

### Error de Build
- Verificar que todas las dependencias estén en package.json
- Asegurarse de que el comando de build funcione localmente

## 🔄 Actualizaciones

### Para actualizar el backend:
1. Hacer commit y push a GitHub
2. Vercel se actualizará automáticamente

### Para actualizar el frontend:
1. Hacer commit y push a GitHub
2. Vercel se actualizará automáticamente

## 📞 Soporte

- **Vercel Dashboard**: [https://vercel.com/andreas-projects-894ffd57](https://vercel.com/andreas-projects-894ffd57)
- **Documentación Vercel**: [https://vercel.com/docs](https://vercel.com/docs)
- **Logs de Vercel**: Disponibles en el dashboard de cada proyecto

## 🎯 Próximos Pasos

1. **Desplegar backend** siguiendo el Paso 1
2. **Desplegar frontend** siguiendo el Paso 2
3. **Configurar variables de entorno** en ambos proyectos
4. **Verificar funcionalidad** completa
5. **Configurar dominio personalizado** (opcional)

---

**¡Tu aplicación SlackTime estará disponible en Vercel! 🚀**
