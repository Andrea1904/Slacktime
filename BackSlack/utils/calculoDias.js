import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const holidaysModule = require('festivos-colombianos');


const holidays = holidaysModule.default || holidaysModule;

/**
 * Calcula los días hábiles entre dos fechas, excluyendo fines de semana y festivos.
 * @param {Date} fechaInicio 
 * @param {Date} fechaFin 
 * @returns {number} Número de días hábiles
 */
export function obtenerDiasHabiles(fechaInicio, fechaFin) {
  const start = new Date(fechaInicio);
  start.setUTCHours(0, 0, 0, 0);

  const end = new Date(fechaFin);
  end.setUTCHours(0, 0, 0, 0);

  let diasLaborales = 0;
  let fechaActual = new Date(start.valueOf());
  while (fechaActual <= end) {
    const diaSemana = fechaActual.getUTCDay(); 
    if (diaSemana >= 1 && diaSemana <= 5) {
      diasLaborales++;
    }
    fechaActual.setUTCDate(fechaActual.getUTCDate() + 1);
  }

  const startYear = start.getUTCFullYear();
  const endYear = end.getUTCFullYear();
  let allHolidays = [];
  for (let year = startYear; year <= endYear; year++) {
    let holidaysForYear = [];
  
    if (typeof holidays === 'function') {

      holidaysForYear = holidays(year);
    } else if (holidays && typeof holidays.getHolidaysByYear === 'function') {
  
      holidaysForYear = holidays.getHolidaysByYear(year);
    } else {
      console.error('Error: La librería "festivos-colombianos" no se pudo usar. No se encontró una función de API válida.');
    }
    allHolidays = allHolidays.concat(holidaysForYear || []); 
  }


  let festivosEnDiasLaborales = 0;
  for (const holiday of allHolidays) {
   
    const holidayDate = new Date(`${holiday.holiday}T00:00:00.000Z`);

   
    if (holidayDate >= start && holidayDate <= end) {
      const diaSemana = holidayDate.getUTCDay();
      if (diaSemana >= 1 && diaSemana <= 5) {
        festivosEnDiasLaborales++;
      }
    }
  }
  const diasHabiles = diasLaborales - festivosEnDiasLaborales;
  console.log(`✅ Días hábiles calculados: ${diasHabiles}`);
  return diasHabiles;
}