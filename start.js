import pkg from 'whatsapp-web.js'; // Importar whatsapp-web.js
import qrcode from 'qrcode-terminal'; // Importar qrcode-terminal
import fs from 'fs'; // Importar fs para manejar archivos
import path from 'path'; // Importar path para manejar rutas

const { Client, LocalAuth } = pkg; // Desestructurar Client y LocalAuth

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

// Escucha los mensajes y manipula lo que queremos que haga el bot
client.on('message', async message => {
    console.log(message.body);
    
    if (message.body.startsWith('/') || message.body.startsWith('.') || message.body.startsWith('#')) {
        const response = getMenu(message.body);
        await message.reply(response.text); // Responder con texto
        
        // Enviar imagen si hay una ruta definida
        await sendImage(message.from, message.body);
    }
});

// Función para devolver el menú basado en el comando
function getMenu(command) {
    switch(command) {
        case '.menu':
            return {
                text: `
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
Att: CEO`,
                imagePath: path.join(__dirname, 'images', 'menu.png') // Ruta absoluta a la imagen del menú
            };

        case '.rangos':
            return {
                text: `
*Rangos-Oficiales*

*Rangos Staff*
✓ C.E.O
✓ ADMIN
✓ MOD
✓ HELPER`,
                imagePath: path.join(__dirname, 'images', 'rangos.png') // Ruta absoluta a la imagen de rangos
            };

        case '.ip':
            return {
                text: 'Pronto la ip',
                imagePath: null // No hay imagen para este comando
            };

        case '.tienda':
            return {
                text: 'En unos días estará la tienda',
                imagePath: path.join(__dirname, 'images', 'tienda.png') // Ruta absoluta a la imagen de la tienda
            };

        case '.comandos':
            return {
                text: 'Información sobre el bot: Este bot puede responder a tus comandos.',
                imagePath: null // No hay imagen para este comando
            };

        case '.dc':
            return {
                text: 'Estamos en proceso',
                imagePath: null // No hay imagen para este comando
            };

        case '.comunidad':
            return {
                text: 'Estamos en proceso',
                imagePath: null // No hay imagen para este comando
            };

        case '.canales':
            return {
                text: 'Estamos en proceso',
                imagePath: null // No hay imagen para este comando
            };   

        case '.strems':
            return {
                text: `
*Streaming oficiales*         
➲ Canal de Twitch
⤷ Enlace

➲ Canal de Youtube
⤷ Enlace`,
                imagePath: path.join(__dirname, 'images', 'streams.png') // Ruta absoluta a la imagen de streams
            };

        case '.donar':
            return {
                text: 'Estamos en proceso',
                imagePath: null // No hay imagen para este comando
            };  

        case '.info':
            return {
                text: 'Hola, soy un bot creado por Edwardofc',
                imagePath: null // No hay imagen para este comando
            };

        default:
            return {
              text: 'Comando no reconocido. Usa .menu para ver los comandos disponibles.',
              imagePath: null // No hay imagen para comandos no reconocidos 
          };
    }
}

// Función para enviar una imagen basada en el comando recibido
async function sendImage(chatId, command) {
    let imagePath;

    switch(command) {
        case '.menu':
            imagePath = path.join(__dirname, 'images', 'menu.png'); // Ruta absoluta a la imagen del menú (cambiada a .png)
            break;
        
        case '.rangos':
            imagePath = path.join(__dirname, 'images', 'rangos.png'); // Ruta absoluta a la imagen de rangos (cambiada a .png)
            break;

        case '.tienda':
            imagePath = path.join(__dirname, 'images', 'tienda.png'); // Ruta absoluta a la imagen de la tienda (cambiada a .png)
            break;

        case '.strems':
            imagePath = path.join(__dirname, 'images', 'strems.png'); // Ruta absoluta a la imagen de streams (cambiada a .png)
            break;

        default:
            return; // No enviar imagen si no hay caso definido.
    }

    // Verifica si la imagen existe antes de enviarla.
    if (!fs.existsSync(imagePath)) {
        console.log(`La imagen ${imagePath} no se encontró.`);
        return; // Salir si no se encuentra
    }

    try {
        await client.sendMessage(chatId, { 
            media: fs.readFileSync(imagePath) 
        });
    } catch (error) {
        console.error(`Error al enviar la imagen: ${error.message}`);
    }
}

// Inicializar el cliente
client.initialize();
