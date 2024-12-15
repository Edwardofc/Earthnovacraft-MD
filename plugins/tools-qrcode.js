import { toDataURL } from 'qrcode';

let handler = async (m, { conn, text }) => {
   if (!text) return conn.reply(m.chat, `🚩 Ingresa un texto junto al comando.`, m);

   // Generar el código QR y enviarlo como imagen
   const qrCodeDataUrl= await toDataURL(text.slice(0, 2048), { scale: 8 });
   
   conn.sendFile(m.chat, qrCodeDataUrl.replace(/^data:image\/png;base64,/g,""), 'qrcode.png', 'Aquí tienes tu código QR:', m);
};

// Configuración del comando
handler.help= ['qrcode *<texto>*']; // Ayuda para el comando
handler.tags= ['tools']; // Etiqueta del comando
handler.command= ['qrcode']; // Comando que activa este handler
handler.register= true; // Requiere registro

export default handler;
