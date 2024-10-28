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
    console.log('Conexión exitosa');
});

// Aquí sucede la magia, escucha los mensajes y aquí es donde se manipula lo que queremos que haga el bot
client.on('message', async message => {
    console.log(message.body);
    
    // Verifica si el mensaje comienza con /, ., o #
    if (message.body.startsWith('/') || message.body.startsWith('.') || message.body.startsWith('#')) {
        const response = getMenu(message.body);
        await message.reply(response); // Asegúrate de usar await aquí
    }
});

// Función para devolver el menú basado en el comando
function getMenu(command) {
    switch(command) {
        case '.menu':
            return `
          *Menu servidor*
🜲 Antes de iniciar coloque el (.)
ᚐ҉ᚐ .rangos
ᚐ҉ᚐ .ip
ᚐ҉ᚐ .tienda
ᚐ҉ᚐ .comandos
ᚐ҉ᚐ .dc
ᚐ҉ᚐ .comunidad
ᚐ҉ᚐ .canales
ᚐ҉ᚐ .strems
ᚐ҉ᚐ .donar
ᚐ҉ᚐ .info
pronto más menú
Att: CEO`;

        case '.rangos':
            return `
*Rangos-Oficiales*

*Rangos Staff*
✓ C.E.O
✓ ADMIN
✓ MOD
✓ HELPER

*Rangos Olimpo*
✓ Zeus   /   Hera
✓ Apolo  /   Atenea
✓ Ares   /   Afrodita

*Rangos Inframundo*
✓ Hades   /   Perséfone
✓ Tanatos /   Freya
✓ Quimera /   Hestia
✓ Cerbero /   Demeter

*Rangos Streams*
⚫ Tiktok
🟣 Twitch
🟢 Kick`;

        case '.ip':
            return 'Pronto la ip';

        case '.tienda':
            return 'En unos días estará la tienda';

        case '.comandos':
            return 'Información sobre el bot: Este bot puede responder a tus comandos.';

        case '.dc':
            return 'Estamos en proceso';

        case '.comunidad':
            return 'Estamos en proceso';

        case '.canales':
            return 'Estamos en proceso';   
                
        case '.strems':
            return `
       *Streaming oficiales*         
➲ Canal de Twitch
  ⤷ Enlace

➲ Canal de Youtube
  ⤷ Enlace

➲ Canal de Kick
  ⤷ Enlace

➲ Canal de TikTok
  ⤷ Enlace`;

        case '.donar':
            return 'Estamos en proceso';  
                
        case '.info':
            return 'Hola, soy un bot creado por Edwardofc';

        default:
            return 'Comando no reconocido. Usa .menu para ver los comandos disponibles.';
    }
}

// Inicializar el cliente
client.initialize();
