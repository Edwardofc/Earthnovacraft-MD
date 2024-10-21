import pkg from 'whatsapp-web.js'; // Importar whatsapp-web.js
import qrcode from 'qrcode-terminal'; // Importar qrcode-terminal

const { Client, LocalAuth } = pkg; // Desestructurar Client y LocalAuth

// Crear una sesión con whatsapp-web y la guarda localmente para autenticarse solo una vez por QR
const client = new Client({
    authStrategy: new LocalAuth() // Usar autenticación local
});

// Genera el código QR para conectarse a whatsapp-web
client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

// Si la conexión es exitosa muestra el mensaje de conexión exitosa
client.on('ready', () => {
    console.log('Conexión exitosa, ¡nenes!');
});

// Aquí sucede la magia, escucha los mensajes y aquí es donde se manipula lo que queremos que haga el bot
client.on('message', message => {
    console.log(message.body);
    
    // Verifica si el mensaje comienza con /, ., o #
    if (message.body.startsWith('/') || message.body.startsWith('.') || message.body.startsWith('#')) {
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
        case '/help':
            return 'Este es el menú de ayuda. Usa .info para más información.';
        case '.nexar':
            return 'Nexar es un gay que le gusta su tio el moreno ya todos sabemos ok no soy un bot no me funen :c';
        case '.dev':
            return 'Hola un saludo cordial para ustedes, de lo cual soy el bot desarrollado por (Edwardofc, Atroofc)';
        case '.devserver':
                return 'Este es un comando esclusivo para comunicarse con los Dev de el desarollo del servidor Earthnovacraft';
        case '.infogroup':
                return 'Pronto estara este comando';
        case '#start':
                return '¡Bienvenido al bot! Escribe /help para más opciones.';
        
         default:
            return 'Comando no reconocido. Usa /help para ver los comandos disponibles.';
    }
}

// Inicializar el cliente
client.initialize();
