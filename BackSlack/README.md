# SlackTime Backend

Backend para el sistema de análisis de tiempo en Slack y reuniones de Microsoft Teams.

## 🚀 Características

- Análisis automático de reuniones de Microsoft Teams
- Clasificación inteligente de tipos de reuniones
- Integración con Microsoft Graph API
- Generación de reportes en Excel
- API RESTful con documentación completa
- Manejo robusto de errores
- Logging detallado

## 📋 Prerrequisitos

- Node.js >= 18.0.0
- npm o yarn
- Cuenta de Microsoft Azure con Microsoft Graph API configurada

## 🛠️ Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd BackSlack
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp env.example .env
   ```
   
   Editar el archivo `.env` con tus credenciales:
   ```env
   PORT=3001
   NODE_ENV=development
   TENANT_ID=your_tenant_id_here
   CLIENT_ID=your_client_id_here
   CLIENT_SECRET=your_client_secret_here
   FRONTEND_URL=http://localhost:4200
   TIMEZONE=America/Bogota
   LOG_LEVEL=info
   ```

4. **Verificar que existe la plantilla Excel**
   Asegúrate de que el archivo `plantillas/Slack Time General.xlsx` existe en el directorio.

## 🚀 Uso

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm start
```

### Otros comandos
```bash
npm run lint          # Ejecutar ESLint
npm run lint:fix      # Corregir errores de ESLint
npm run format        # Formatear código con Prettier
npm run clean         # Limpiar archivos generados
```

## 📡 API Endpoints

### POST /procesar
Procesa los datos de reuniones y genera un reporte Excel.

**Body:**
```json
{
  "nombreGrupo": "string",
  "fechaInicio": "2024-01-01T00:00:00.000Z",
  "fechaFin": "2024-01-31T23:59:59.999Z",
  "personas": [
    {
      "nombre": "Juan Pérez",
      "correo": "juan.perez@company.com"
    }
  ],
  "correos": ["juan.perez@company.com"]
}
```

**Response:**
```json
{
  "success": true,
  "fileUrl": "/output/SlackTime_1234567890.xlsx",
  "stats": {
    "totalCorreos": 5,
    "procesadosExitosamente": 5,
    "diasHabiles": 22,
    "fechaInicio": "2024-01-01T00:00:00.000Z",
    "fechaFin": "2024-01-31T23:59:59.999Z"
  }
}
```

### GET /health
Verifica el estado de salud del servidor.

### GET /test
Prueba básica de conectividad.

## 🏗️ Estructura del Proyecto

```
BackSlack/
├── index.js              # Punto de entrada principal
├── package.json          # Dependencias y scripts
├── env.example           # Variables de entorno de ejemplo
├── utils/                # Utilidades y helpers
│   ├── auth.js          # Autenticación con Microsoft Graph
│   ├── calendar.js      # Manejo de calendarios
│   ├── benefitsReader.js # Lectura de beneficios
│   └── calculoDias.js   # Cálculo de días hábiles
├── plantillas/          # Plantillas Excel
├── output/              # Archivos generados
└── README.md           # Este archivo
```

## 🔧 Configuración de Microsoft Graph API

1. Ve a [Azure Portal](https://portal.azure.com)
2. Crea una nueva aplicación registrada
3. Configura los permisos necesarios:
   - `Calendars.Read` para leer calendarios
   - `User.Read.All` para leer información de usuarios
4. Obtén las credenciales (Tenant ID, Client ID, Client Secret)
5. Configúralas en el archivo `.env`

## 🐛 Solución de Problemas

### Error de autenticación
- Verifica que las credenciales en `.env` sean correctas
- Asegúrate de que la aplicación tenga los permisos necesarios

### Error de conexión
- Verifica que el servidor esté ejecutándose en el puerto correcto
- Revisa los logs del servidor para más detalles

### Error de plantilla Excel
- Asegúrate de que el archivo `plantillas/Slack Time General.xlsx` existe
- Verifica que el archivo no esté corrupto

## 📝 Logs

El servidor genera logs detallados que incluyen:
- Información de inicio del servidor
- Progreso del procesamiento de correos
- Errores y excepciones
- Estadísticas de procesamiento

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👥 Autores

- **SlackTime Team** - *Desarrollo inicial*

## 🙏 Agradecimientos

- Microsoft Graph API por la integración con Teams
- ExcelJS por el manejo de archivos Excel
- Luxon por el manejo de fechas y zonas horarias

