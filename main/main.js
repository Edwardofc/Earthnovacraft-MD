import { makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, Browsers } from '@whiskeysockets/baileys';
import chalk from 'chalk';

async function main() {
    try {
        // Cargar credenciales de autenticación
        const { state, saveCreds } = await useMultiFileAuthState('sessions');
        const { version } = await fetchLatestBaileysVersion();

        // Crear socket de WhatsApp
        const conn = makeWASocket({
            version,
            printQRInTerminal: true,
            auth: state,
            browser: Browsers.ubuntu('Chrome'),
        });

        // Manejo de eventos de conexión
        conn.ev.on('connection.update', async (update) => {
            const { connection } = update;
            if (connection === 'open') {
                console.log(chalk.cyan('Conectado correctamente.'));
                await saveCreds(); // Guardar credenciales
            } else if (connection === 'close') {
                console.log(chalk.red('Conexión cerrada, reiniciando...'));
                // Aquí puedes agregar lógica para reiniciar la conexión si es necesario
            }
        });

        // Manejo de mensajes entrantes
        conn.ev.on('messages.upsert', async (msg) => {
            const message = msg.messages[0];
            if (!message || !message.key || message.key.fromMe) return; // Ignorar mensajes que no son del bot

            // Procesar el mensaje
            let m = message;
            
            // Asegurarse de que el mensaje tenga un cuerpo válido
            if (!m || !m.body) return; 
            const command = m.body.trim().split(' ')[0].toLowerCase(); // Obtener el comando en minúsculas

            // Lógica para manejar comandos
            switch (command) {
                case '!menu':
                case '?':
                    await showMenu(conn, m.chat);
                    break;
                // Agrega más comandos aquí según sea necesario
                default:
                    console.log(`Comando desconocido: ${command}`);
                    break;
            }
        });
    } catch (error) {
        console.error('Error al iniciar main.js:', error);
    }
}

// Función para mostrar el menú de comandos
async function showMenu(conn, chatId) {
    const menuText = `
*Menú de Comandos:*

1. *!tagall* - Etiqueta a todos los miembros del grupo.
2. *!delete* - Elimina un mensaje específico.
3. *!shop* - Accede a la tienda virtual.
4. *!creator* - Información sobre el creador del bot.
5. *!dalle <texto>* - Genera una imagen basada en la descripción proporcionada.
6. *!gemini <petición>* - Realiza una consulta a la API de Gemini.
7. *!qrcode <texto>* - Genera un código QR a partir del texto proporcionado.

Para más información, usa !help.
`;
    await conn.reply(chatId, menuText);
}

// Iniciar la función principal
main();
