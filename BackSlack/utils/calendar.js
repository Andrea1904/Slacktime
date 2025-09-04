import fetch from 'node-fetch';
import { DateTime } from 'luxon';

export async function obtenerHorasReuniones(correo, inicio, fin, token, timeZone) {
  let eventos = [];
  const inicioISO = DateTime.fromJSDate(inicio).toISO();
  const finISO = DateTime.fromJSDate(fin).toISO();

  let url = `https://graph.microsoft.com/v1.0/users/${correo}/calendarView?startDateTime=${inicioISO}&endDateTime=${finISO}&$top=100`;

  const headers = {
    Authorization: `Bearer ${token}`,
    Prefer: `outlook.timezone="${timeZone}"`
  };

  while (url) {
    try {
      const res = await fetch(url, { headers });
      const data = await res.json();

      if (data.error) {
        console.error(`❌ Error con ${correo}:`, data.error.message);
        return [];
      }

      eventos = eventos.concat(data.value || []);
      url = data['@odata.nextLink'] || null;  
    } catch (error) {
      console.error('Error al hacer la solicitud:', error);
      return [];
    }
  }

  eventos = eventos.filter(evento => {
    const asunto = evento.subject || '';

    if (asunto.toLowerCase().includes("día sin reuniones") || asunto.toLowerCase().includes("tiempo de concentración") || 
        asunto.toLowerCase().includes("dia sin reuniones")) {
   
      return false;  
    }
    return true; 
  });

  eventos.forEach(evento => {
    const asunto = evento.subject || '(Sin asunto)';
    const inicio = evento.start?.dateTime;
    const fin = evento.end?.dateTime;
    const zona = evento.start?.timeZone || timeZone;
    const dtInicio = DateTime.fromISO(inicio, { zone: zona });
    const dtFin = DateTime.fromISO(fin, { zone: zona });
    const duracion = Math.round(dtFin.diff(dtInicio).as('minutes'));
  });

  return eventos;
}
