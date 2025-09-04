# 📊 SlackTime

Sistema completo para el análisis de tiempo en reuniones de Microsoft Teams y gestión de beneficios laborales.

## 🎯 Descripción

SlackTime es una aplicación web que permite analizar automáticamente las reuniones de Microsoft Teams de diferentes grupos de trabajo, clasificarlas por tipo (ceremonias, rutas, reuniones generales, etc.) y generar reportes detallados en Excel que incluyen también los beneficios laborales de cada persona.

## 🚀 Características Principales

### Backend (Node.js + Express)
- ✅ Integración con Microsoft Graph API
- ✅ Análisis automático de calendarios de Teams
- ✅ Clasificación inteligente de tipos de reuniones
- ✅ Cálculo de días hábiles y festivos
- ✅ Generación de reportes Excel personalizados
- ✅ API RESTful con documentación completa
- ✅ Manejo robusto de errores y logging

### Frontend (Angular + Material)
- ✅ Interfaz moderna y responsiva
- ✅ Formularios reactivos con validación
- ✅ Selección de grupos y personas predefinidas
- ✅ Estados de carga y feedback visual
- ✅ Descarga automática de reportes
- ✅ Diseño responsive para móviles

## 🏗️ Arquitectura

```
SlackTime/
├── BackSlack/           # Backend Node.js
│   ├── index.js        # Servidor principal
│   ├── utils/          # Utilidades y helpers
│   ├── plantillas/     # Plantillas Excel
│   └── output/         # Archivos generados
├── FrontSlack/         # Frontend Angular
│   ├── src/app/        # Componentes Angular
│   └── dist/           # Build de producción
└── ScraperBeneficios/  # Módulo de beneficios (futuro)
```

## 📋 Prerrequisitos

- **Node.js** >= 18.0.0
- **npm** o **yarn**
- **Angular CLI** >= 20.0.0
- **Cuenta de Microsoft Azure** con Microsoft Graph API configurada

## 🛠️ Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd SlackTime
```

### 2. Configurar el Backend
```bash
cd BackSlack
npm install
cp env.example .env
```

Editar `.env` con tus credenciales:
```env
PORT=3001
TENANT_ID=your_tenant_id_here
CLIENT_ID=your_client_id_here
CLIENT_SECRET=your_client_secret_here
FRONTEND_URL=http://localhost:4200
TIMEZONE=America/Bogota
```

### 3. Configurar el Frontend
```bash
cd ../FrontSlack
npm install
```

### 4. Verificar plantilla Excel
Asegúrate de que existe `BackSlack/plantillas/Slack Time General.xlsx`

## 🚀 Ejecución

### Desarrollo

**Terminal 1 - Backend:**
```bash
cd BackSlack
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd FrontSlack
npm start
```

### Producción

**Backend:**
```bash
cd BackSlack
npm start
```

**Frontend:**
```bash
cd FrontSlack
npm run build
```

## 📡 API Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/health` | Estado de salud del servidor |
| `GET` | `/test` | Prueba de conectividad |
| `POST` | `/procesar` | Procesar datos y generar reporte |

### Ejemplo de uso de la API

```bash
curl -X POST http://localhost:3001/procesar \
  -H "Content-Type: application/json" \
  -d '{
    "nombreGrupo": "Synecta",
    "fechaInicio": "2024-01-01T00:00:00.000Z",
    "fechaFin": "2024-01-31T23:59:59.999Z",
    "personas": [
      {
        "nombre": "Juan Pérez",
        "correo": "juan.perez@company.com"
      }
    ],
    "correos": ["juan.perez@company.com"]
  }'
```

## 🎨 Interfaz de Usuario

### Características de UX
- **Selección de grupos**: Dropdown con grupos predefinidos
- **Visualización de personas**: Lista con nombres y correos
- **Configuración de fechas**: Datepickers con validación
- **Estados de carga**: Spinners y mensajes informativos
- **Feedback visual**: Notificaciones de éxito/error
- **Responsive design**: Adaptable a móviles y desktop

### Flujo de trabajo
1. Seleccionar grupo de trabajo
2. Verificar personas incluidas
3. Configurar período de análisis
4. Enviar solicitud de procesamiento
5. Esperar generación del reporte
6. Descarga automática del archivo Excel

## 🔧 Configuración de Microsoft Graph API

### 1. Crear aplicación en Azure Portal
1. Ve a [Azure Portal](https://portal.azure.com)
2. Azure Active Directory → App registrations
3. New registration
4. Configura nombre y URL de redirección

### 2. Configurar permisos
- `Calendars.Read` - Para leer calendarios
- `User.Read.All` - Para leer información de usuarios

### 3. Obtener credenciales
- **Tenant ID**: ID del directorio
- **Client ID**: ID de la aplicación
- **Client Secret**: Secret generado

### 4. Configurar en .env
```env
TENANT_ID=your_tenant_id
CLIENT_ID=your_client_id
CLIENT_SECRET=your_client_secret
```

## 📊 Tipos de Reuniones Clasificadas

| Tipo | Palabras clave |
|------|----------------|
| **Ceremonias** | ceremonia, refinamiento, refi, review, daily, planning, retro, retrospectiva |
| **Rutas** | ruta |
| **Seekers** | seeker |
| **Transferencia** | transferencia |
| **Plan Carrera** | plan carrera |
| **Reuniones** | (cualquier otra) |

## 🐛 Solución de Problemas

### Error de autenticación
```bash
# Verificar credenciales
cat BackSlack/.env

# Verificar permisos de la app
# Ir a Azure Portal → App registrations → API permissions
```

### Error de conexión
```bash
# Verificar que el backend esté ejecutándose
curl http://localhost:3001/health

# Verificar logs
cd BackSlack
npm run dev
```

### Error de CORS
```bash
# Verificar configuración en BackSlack/index.js
# Asegurarse de que FRONTEND_URL esté configurado correctamente
```

### Error de plantilla Excel
```bash
# Verificar que existe la plantilla
ls BackSlack/plantillas/

# Verificar permisos de lectura
chmod 644 BackSlack/plantillas/Slack\ Time\ General.xlsx
```

## 📈 Métricas y Logs

### Logs del Backend
- Inicio del servidor
- Progreso de procesamiento por correo
- Errores y excepciones
- Estadísticas finales

### Métricas incluidas en reportes
- Total de horas por tipo de reunión
- Días hábiles en el período
- Beneficios laborales por persona
- Estadísticas de procesamiento

## 🔮 Roadmap

### Próximas características
- [ ] Dashboard con gráficos y estadísticas
- [ ] Exportación a PDF
- [ ] Notificaciones por email
- [ ] API para integración con otros sistemas
- [ ] Módulo de beneficios mejorado
- [ ] Autenticación de usuarios
- [ ] Historial de reportes generados

### Mejoras técnicas
- [ ] Tests unitarios y e2e
- [ ] Dockerización
- [ ] CI/CD pipeline
- [ ] Monitoreo y alertas
- [ ] Cache de datos
- [ ] Rate limiting

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Guías de contribución
- Sigue las convenciones de código existentes
- Agrega tests para nuevas funcionalidades
- Actualiza la documentación según sea necesario
- Verifica que el build pase antes de hacer PR

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👥 Equipo

- **SlackTime Team** - *Desarrollo inicial*

## 🙏 Agradecimientos

- **Microsoft Graph API** por la integración con Teams
- **ExcelJS** por el manejo de archivos Excel
- **Luxon** por el manejo de fechas y zonas horarias
- **Angular Material** por los componentes UI
- **Express.js** por el framework del backend

## 📞 Soporte

Para soporte técnico o preguntas:
- Crear un issue en GitHub
- Revisar la documentación en `/BackSlack/README.md` y `/FrontSlack/README.md`
- Verificar la sección de solución de problemas

---

**SlackTime** - Optimizando el tiempo de trabajo, una reunión a la vez. 🚀

