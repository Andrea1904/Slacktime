import fetch from 'node-fetch';

export async function obtenerToken() {

  const TENANT_ID = process.env.TENANT_ID;
  const CLIENT_ID = process.env.CLIENT_ID;
  const CLIENT_SECRET = process.env.CLIENT_SECRET;


  if (!TENANT_ID || !CLIENT_ID || !CLIENT_SECRET) {
    console.error("Asegúrate de que TENANT_ID, CLIENT_ID, y CLIENT_SECRET estén en tu archivo .env");
    throw new Error("Faltan credenciales de autenticación en la configuración del servidor.");
  }

  const url = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`;
  const params = new URLSearchParams();
  params.append("client_id", CLIENT_ID);
  params.append("client_secret", CLIENT_SECRET);
  params.append("grant_type", "client_credentials");
  params.append("scope", "https://graph.microsoft.com/.default");

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString()
  });

  const data = await res.json();

  if (!res.ok || !data.access_token) {
    console.error("❌ Error al obtener el token:", data);
    throw new Error("Token inválido o error al autenticar.");
  }

  return data.access_token;
}