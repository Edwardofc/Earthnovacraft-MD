import { Client } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import fs from 'fs';
import path from 'path';

// Ruta del archivo de sesión
const sessionFilePath = path.join(process.cwd(), 'session.json');

// Cargar la sesión desde el archivo si existe
let sessionData;
if (fs.existsSync(sessionFilePath)) {
    sessionData = JSON.parse(fs.readFileSync(sessionFilePath, 'utf8'));
}

// Crear una nueva instancia del cliente
const client = new Client({ session: sessionData });

// Evento para generar y mostrar el código QR
client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

// Evento cuando el cliente está listo
client.on('ready', () => {
    console.log('Bot está listo!');

    // Guardar la sesión en un archivo
    client.getSession().then((session) => {
        fs.writeFileSync(sessionFilePath, JSON.stringify(session));
    });
});

// Evento para manejar mensajes entrantes
client.on('message', message => {
    console.log(message.body);
    
    // Verifica si el mensaje comienza con /, ., o #
    if (message.body.startsWith('/') || message.body.startsWith('.') || message.body.startsWith('#')) {
        // Aquí puedes añadir la lógica para manejar comandos
        const response = getMenu(message.body);
        message.reply(response);
    }
});

// Función para devolver el menú basado en el comando
function getMenu(command) {
    switch(command) {
        case '/help':
            return 'Este es el menú de ayuda. Usa .info para más información.';
        case '.info':
            return 'Información sobre el bot: Este bot puede responder a tus comandos.';
        case '#start':
            return '¡Bienvenido al bot! Escribe /help para más opciones.';
        default:
            return 'Comando no reconocido. Usa /help para ver los comandos disponibles.';
    }
}

// Inicializar el cliente
client.initialize();
