import fs from 'fs';
import path from 'path';
import ExcelJS from 'exceljs';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { DateTime } from 'luxon';
import { obtenerToken } from './utils/auth.js';
import { obtenerHorasReuniones } from './utils/calendar.js';
import { obtenerHorasBeneficios } from './utils/benefitsReader.js';
import { obtenerDiasHabiles } from './utils/calculoDias.js';

dotenv.config();

// Configuración
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CONFIG = {
  PORT: process.env.PORT || 3001,
  PLANTILLA_PATH: path.join(__dirname, "plantillas", "Slack Time General.xlsx"),
  SALIDA_DIR: path.join("output"),
  TIMEZONE: "America/Bogota",
  MAX_RETRIES: 3,
  REQUEST_TIMEOUT: 30000
};

// Inicialización de Express
const app = express();

// Middleware
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:4200',
    'https://slacktime-frontend.vercel.app',
    'https://slacktime.vercel.app'
  ],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/output', express.static(path.join(__dirname, 'output')));

// Utilidades
function normalizarCorreo(correo) {
  return correo.toLowerCase().trim();
}

function clasificarEvento(subject) {
  if (!subject) return 'reuniones';
  
  const subjectLower = subject.toLowerCase();
  const clasificaciones = {
    ceremonia: [
      'ceremonia', 'refinamiento', 'refi', 'review', 'daily', 
      'refi-planning', 'planning', 'retro', 'retrospectiva', 
      'pre-review', 'def-arquitectura', 'escenarios de calidad'
    ],
    rutas: ['ruta'],
    seekers: ['seeker'],
    transferencia: ['transferencia'],
    plancarrera: ['plan carrera']
  };

  for (const [tipo, palabras] of Object.entries(clasificaciones)) {
    if (palabras.some(palabra => subjectLower.includes(palabra))) {
      return tipo;
    }
  }

  return 'reuniones';
}

function validarDatosEntrada(datos) {
  const { correos, nombreGrupo, fechaInicio, fechaFin, personas } = datos;
  
  if (!nombreGrupo || !fechaInicio || !fechaFin || !personas || !Array.isArray(personas) || personas.length === 0) {
    throw new Error('Faltan parámetros necesarios o las personas están vacías');
  }

  if (!Array.isArray(correos)) {
    throw new Error('El campo "correos" debe ser un arreglo');
  }

  for (let persona of personas) {
    if (!persona.nombre || !persona.correo) {
      throw new Error('Cada persona debe tener un nombre y correo');
    }
  }

  const fechaInicioDate = new Date(fechaInicio);
  const fechaFinDate = new Date(fechaFin);

  if (isNaN(fechaInicioDate.getTime()) || isNaN(fechaFinDate.getTime())) {
    throw new Error('Las fechas proporcionadas no son válidas');
  }

  return { fechaInicioDate, fechaFinDate };
}

async function procesarCorreo(correo, fechaInicio, fechaFin, token, timezone) {
  const eventos = await obtenerHorasReuniones(correo, fechaInicio, fechaFin, token, timezone);
  
  const totales = {
    ceremonias: 0,
    reuniones: 0,
    rutas: 0,
    seekers: 0,
    transferencia: 0,
    plancarrera: 0
  };

  for (const evento of eventos) {
    const inicio = DateTime.fromISO(evento.start.dateTime, { zone: evento.start.timeZone || timezone });
    const fin = DateTime.fromISO(evento.end.dateTime, { zone: evento.end.timeZone || timezone });
    const duracion = Math.round(fin.diff(inicio, 'minutes').minutes);

    const tipo = clasificarEvento(evento.subject);
    
    if (totales.hasOwnProperty(tipo)) {
      totales[tipo] += duracion;
    } else {
      totales.reuniones += duracion;
    }
  }

  // Convertir minutos a horas
  const resultado = {};
  for (const [tipo, minutos] of Object.entries(totales)) {
    resultado[tipo] = minutos / 60;
  }

  resultado.total = Object.values(resultado).reduce((sum, horas) => sum + horas, 0);
  
  return resultado;
}

async function generarExcel(resultados, correos, fechaInicio, fechaFin, diasHabiles, totalCorreosRecibidos, horasBeneficiosPorCorreo) {
  if (!fs.existsSync(CONFIG.SALIDA_DIR)) {
    fs.mkdirSync(CONFIG.SALIDA_DIR, { recursive: true });
  }

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(CONFIG.PLANTILLA_PATH);
  const sheet = workbook.worksheets[0];

  const fechaInicioFormatted = DateTime.fromJSDate(fechaInicio).toFormat('yyyy-LL-dd');
  const fechaFinFormatted = DateTime.fromJSDate(fechaFin).toFormat('yyyy-LL-dd');
  const fechasConcatenadas = `Slacktime Fecha Inicio: ${fechaInicioFormatted} | Fecha Fin: ${fechaFinFormatted}`;
  
  sheet.getCell('B1').value = fechasConcatenadas;

  let rowIndex = 3;
  for (const correo of correos) {
    const datos = resultados[normalizarCorreo(correo)];
    const row = sheet.getRow(rowIndex);
    
    row.getCell(2).value = correo;

    if (datos.error) {
      row.getCell(3).value = `Error: ${datos.error}`;
      rowIndex++;
      continue;
    }

    // Llenar datos en las columnas correspondientes
    row.getCell(4).value = Math.round(datos.ceremonias * 100) / 100;
    row.getCell(6).value = Math.round(datos.reuniones * 100) / 100;

    const horas = horasBeneficiosPorCorreo[normalizarCorreo(correo)];
    if (horas !== undefined && !isNaN(horas)) {
      row.getCell(5).value = Math.round(horas * 100) / 100;
    }

    row.getCell(7).value = Math.round(datos.plancarrera * 100) / 100;
    row.getCell(8).value = Math.round(datos.rutas * 100) / 100;
    row.getCell(9).value = Math.round(datos.transferencia * 100) / 100;
    row.getCell(10).value = Math.round(datos.seekers * 100) / 100;

    const totalCell = row.getCell(12);
    if (datos.total && datos.total > 0) {
      totalCell.value = Math.round(datos.total * 100) / 100;
    } else {
      totalCell.value = null;
    }

    rowIndex++;
  }

  sheet.getCell('G16').value = diasHabiles;
  sheet.getCell('G15').value = totalCorreosRecibidos;

  const outputFile = `SlackTime_${Date.now()}.xlsx`;
  const outputPath = path.join(CONFIG.SALIDA_DIR, outputFile);
  await workbook.xlsx.writeFile(outputPath);

  return outputFile;
}

// Rutas
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

app.get('/api/test', (req, res) => {
  res.send('Servidor está funcionando');
});

app.post('/api/procesar', async (req, res) => {
  try {
    console.log('📥 Recibiendo solicitud de procesamiento...');
    
    const datos = req.body;
    const { fechaInicioDate, fechaFinDate } = validarDatosEntrada(datos);
    
    console.log(`📊 Procesando ${datos.correos.length} correos...`);
    
    const token = await obtenerToken();
    if (!token || typeof token !== 'string' || !token.includes('.')) {
      throw new Error("Token recibido no es un JWT válido");
    }

    const diasHabiles = obtenerDiasHabiles(fechaInicioDate, fechaFinDate);
    const horasBeneficiosPorCorreo = obtenerHorasBeneficios(
      datos.correos.map(c => normalizarCorreo(c))
    );

    const resultados = {};
    let totalCorreosRecibidos = 0;

    // Procesar correos con manejo de errores individual
    for (const correo of datos.correos) {
      try {
        console.log(`🔄 Procesando: ${correo}`);
        const resultado = await procesarCorreo(
          correo, 
          fechaInicioDate, 
          fechaFinDate, 
          token, 
          CONFIG.TIMEZONE
        );
        
        resultados[normalizarCorreo(correo)] = resultado;
        totalCorreosRecibidos++;
        console.log(`✅ ${correo} procesado exitosamente`);
      } catch (err) {
        console.error(`❌ Error con ${correo}: ${err.message}`);
        resultados[normalizarCorreo(correo)] = { error: err.message };
      }
    }

    console.log('📝 Generando archivo Excel...');
    const outputFile = await generarExcel(
      resultados, 
      datos.correos, 
      fechaInicioDate, 
      fechaFinDate, 
      diasHabiles, 
      totalCorreosRecibidos, 
      horasBeneficiosPorCorreo
    );

    console.log(`✅ Archivo Excel generado: ${outputFile}`);
    
    res.json({ 
      success: true, 
      fileUrl: `/output/${outputFile}`,
      stats: {
        totalCorreos: datos.correos.length,
        procesadosExitosamente: totalCorreosRecibidos,
        diasHabiles,
        fechaInicio: fechaInicioDate.toISOString(),
        fechaFin: fechaFinDate.toISOString()
      }
    });

  } catch (error) {
    console.error("❌ Error al procesar la solicitud:", error);
    res.status(500).json({ 
      error: 'Error al procesar la solicitud',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Middleware de manejo de errores
app.use((error, req, res, next) => {
  console.error('Error no manejado:', error);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Algo salió mal'
  });
});

// Iniciar servidor
app.listen(CONFIG.PORT, () => {
  console.log(`🚀 Servidor backend iniciado en http://localhost:${CONFIG.PORT}`);
  console.log(`📁 Directorio de salida: ${CONFIG.SALIDA_DIR}`);
  console.log(`⏰ Zona horaria: ${CONFIG.TIMEZONE}`);
});
