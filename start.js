import pkg from 'whatsapp-web.js'; // Importar whatsapp-web.js
import qrcode from 'qrcode-terminal'; // Importar qrcode-terminal
import fs from 'fs'; // Importar fs para manejar archivos

const { Client, LocalAuth } = pkg; // Desestructurar Client y LocalAuth

const client = new Client({
    authStrategy: new LocalAuth() // Usar autenticación local
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Conexión exitosa');
});

client.on('message', async message => {
    console.log(message.body);
    
    if (message.body.startsWith('/') || message.body.startsWith('.') || message.body.startsWith('#')) {
        const response = getMenu(message.body);
        await message.reply(response.text); // Responder con texto
        if (response.imagePath) {
            await client.sendMessage(message.from, fs.readFileSync(response.imagePath), { caption: 'Aquí tienes la imagen' }); // Enviar imagen
        }
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
                imagePath: './images/menu.png' // No hay imagen para este comando
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
                imagePath: './images/rangos.png' // Ruta a la imagen de rangos
            };

        case '.ip':
            return {
                text: 'Pronto la ip',
                imagePath: './images/ip.png' // No hay imagen para este comando
            };

        case '.tienda':
            return {
                text: 'En unos días estará la tienda',
                imagePath: './images/tienda.png' // Ruta a la imagen de la tienda
            };

        case '.comandos':
            return {
                text: 'Información sobre el bot: Este bot puede responder a tus comandos.',
                imagePath: './images/comandos.png' // No hay imagen para este comando
            };

        case '.dc':
            return {
                text: 'Estamos en proceso',
                imagePath: './images/dc.png' // No hay imagen para este comando
            };

        case '.comunidad':
            return {
                text: 'Estamos en proceso',
                imagePath: './images/comunidad.png' // No hay imagen para este comando
            };

        case '.canales':
            return {
                text: 'Estamos en proceso',
                imagePath: './images/canales.png' // No hay imagen para este comando
            };   

        case '.strems':
            return {
                text: `
                *Streaming oficiales*         
                ➲ Canal de Twitch
                  ⤷ Enlace

                ➲ Canal de Youtube
                  ⤷ Enlace`,
                imagePath: './images/streams.png' // Ruta a la imagen de streams
            };

        case '.donar':
            return {
                text: 'Estamos en proceso',
                imagePath: './images/donar.png' // No hay imagen para este comando
            };  

        case '.info':
            return {
                text: 'Hola, soy un bot creado por Edwardofc',
                imagePath: './images/info.png' // No hay imagen para este comando
            };

        default:
            return {
              text: 'Comando no reconocido. Usa .menu para ver los comandos disponibles.',
              imagePath: null // No hay imagen para comandos no reconocidos 
          };
    }
}

client.initialize();
