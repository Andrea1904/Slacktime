import xlsx from "xlsx";
import fs from "fs";
import path from "path";

export function obtenerHorasBeneficios(correosFiltro = []) {
  const plantillaPath = path.join("plantillas");
  const files = fs.readdirSync(plantillaPath);

  const file = files.find(f => f.includes("Reporte de Beneficios") && f.endsWith(".xlsx"));
  if (!file) {
    console.error("No se encontró un archivo de beneficios.");
    return [];
  }

  const workbook = xlsx.readFile(path.join(plantillaPath, file));
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const sheetData = xlsx.utils.sheet_to_json(sheet, { header: 1 });

  const data = sheetData.slice(6);

  const beneficiosFiltrados = ["Más tiempo", "Mas tiempo", "Día de la familia", "Licencia por luto", "Grados"];
  const resultados = [];

  for (const row of data) {
    const [fullName, email, fechaSolicitud, beneficio, fechaResolucion, categoria, detalle] = row;
    if (!beneficio || !beneficiosFiltrados.some(b => beneficio.toLowerCase().includes(b.toLowerCase()))) continue;
    if (!email || (correosFiltro.length && !correosFiltro.includes(email.trim().toLowerCase()))) continue;

    let fechaInicio, fechaFin, horas = "", dias = 1;

    if (beneficio.toLowerCase().includes("más tiempo") || beneficio.toLowerCase().includes("mas tiempo")) {
      const matchFecha = detalle.match(/Fecha.*?: (\d{2}-\d{2}-\d{4})/);
      const cantidadJornadas = (detalle.match(/Jornada:/gi) || []).length || 1;
      if (matchFecha) fechaInicio = fechaFin = matchFecha[1];
      // Detectar cuántas horas dice el texto, por ejemplo "Mas tiempo (2 horas)"
      const matchHorasTexto = beneficio.match(/(\d+)\s*hora/);
      const horasPorJornada = matchHorasTexto ? parseInt(matchHorasTexto[1]) : 2; // por defecto 2h si no se especifica
      horas = (cantidadJornadas * horasPorJornada).toString();
    } else if (beneficio.toLowerCase().includes("día de la familia")) {
      const match = detalle.match(/(\d{2}-\d{2}-\d{4})/);
      if (match) fechaInicio = fechaFin = match[1];
      horas = "8";
    } else if (beneficio.toLowerCase().includes("grados")) {
      const match = detalle.match(/(\d{2}-\d{2}-\d{4})/g);
      const jornadas = (detalle.match(/Jornada:/gi) || []).length || 1;
      if (match && match.length > 0) {
        fechaInicio = fechaFin = match[0]; // Usamos la primera fecha
      }
      horas = (jornadas * 4).toString(); // 4 horas por cada jornada
    } else if (beneficio.toLowerCase().includes("licencia por luto")) {
      const matchInicio = detalle.match(/Fecha inicio: (\d{2}-\d{2}-\d{4})/);
      const matchFin = detalle.match(/Fecha fin: (\d{2}-\d{2}-\d{4})/);
      if (matchInicio) fechaInicio = matchInicio[1];
      if (matchFin) fechaFin = matchFin[1];
    }

    if (fechaInicio && fechaFin) {
      const [d1, m1, y1] = fechaInicio.split("-").map(Number);
      const [d2, m2, y2] = fechaFin.split("-").map(Number);
      const date1 = new Date(y1, m1 - 1, d1);
      const date2 = new Date(y2, m2 - 1, d2);
      const diff = Math.floor((date2 - date1) / (1000 * 60 * 60 * 24));
      dias = diff >= 0 ? diff + 1 : 1;

      if (beneficio.toLowerCase().includes("licencia por luto")) {
        horas = (dias * 8).toString();
      }
    }

    resultados.push({
      email: email.trim().toLowerCase(),
      horas: parseInt(horas) || 0
    });
  }

  // Sumar horas por correo
  const resumen = {};
  for (const { email, horas } of resultados) {
    if (!resumen[email]) resumen[email] = 0;
    resumen[email] += horas;
  }
 // console.log("Resumen de horas por correo:", resumen);

  return resumen;
}

