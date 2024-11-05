import pkg from 'whatsapp-web.js'; // Importar whatsapp-web.js
import qrcode from 'qrcode-terminal'; // Importar qrcode-terminal
import fs from 'fs'; // Importar fs para manejar archivos
import path from 'path'; // Importar path para manejar rutas
import { fileURLToPath } from 'url'; // Importar fileURLToPath para definir __dirname

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Client, LocalAuth, MessageMedia } = pkg; // Desestructurar Client, LocalAuth y MessageMedia

// Configurar el cliente con la opción de no usar sandbox
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

// Genera el código QR para conectarse a whatsapp-web
client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

// Si la conexión es exitosa muestra el mensaje de conexión exitosa
client.on('ready', () => {
    console.log('🎉 Conexión exitosa');
});

// Escucha los mensajes y manipula lo que queremos que haga el bot
client.on('message', async message => {
    console.log(`📩 Mensaje recibido: ${message.body}`);
    
    if (message.body.startsWith('.') || message.body.startsWith('/') || message.body.startsWith('#')) {
        const response = getMenu(message.body);
        console.log(`📢 Comando detectado: ${message.body}`);
        
        // Enviar imagen y texto juntos
        await sendImageWithText(message.from, response);
    }
});

// Función para devolver el menú basado en el comando
function getMenu(command) {
    switch(command) {
        case '.menu':
            return {
                text: `
*🌐 Menú Servidor*
👉 Antes de iniciar coloque el (.)
📋 .rangos
🌐 .ip
🛒 .tienda
📜 .comandos
🎮 .dc
💬 .comunidad
📺 .strems
💖 .donar
ℹ️ .info
📝 Att: CEO`,
                imagePath: path.join(__dirname, 'images', 'menu.png')
            };
        case '.rangos':
            return {
                text: `
*🏆 Rangos Oficiales*

*👥 Rangos Staff*
👑 C.E.O
🛡️ ADMIN
👮 MOD
🤝 HELPER

*⚡ Rangos Olimpo ⚡*
⚡ Zeus
👸 Hera
🎯 Apolo
🏹 Atenea
⚔️ Ares
💘 Afrodita

*🔥 Rangos Inframundo 🔥*
💀 Hades
🌸 Perséfone
🕯️ Tanatos
👑 Freya
🐉 Quimera
🔥 Hestia
🐕 Cerbero
🌾 Demeter`,
                imagePath: path.join(__dirname, 'images', 'rangos.png')
            };
        case '.ip':
            return {
                text: `💻 IP JAVA: 
📲 IP BEDROCK: 
🔢 PUERTO: `,
                imagePath: path.join(__dirname, 'images', 'ip.png')
            };
        case '.tienda':
            return {
                text: `🛒 COMPRA TUS RANGOS AQUÍ:
https://eartnovacraft.tebex.io/`,
                imagePath: path.join(__dirname, 'images', 'tienda.png')
            };
        case '.strems':
            return {
                text: `
*🎥 Streaming Oficiales*         
📺 Canal de Twitch
🔗 Enlace
🎬 Canal de YouTube
🔗 Enlace`,
                imagePath: path.join(__dirname, 'images', 'streams.png')
            };
        case '.comandos':
            return {
                text: `👋 ¡Hola! Soy un bot diseñado para ayudarte y responder tus comandos. 
Usa .menu para ver la lista completa de mis funciones y comandos.

Aquí algunos comandos básicos que puedes probar:
📌 Escribe ".menu" para ver todos los comandos disponibles.
📌 Usa ".info" para obtener información sobre el bot`,
                imagePath: null
            };
        case '.dc':
            return {
                text: '🌐 https://discord.gg/b84UEX52',
                imagePath: path.join(__dirname, 'images', 'dc.png')
            };
        case '.comunidad':
            return {
                text: `*📜 Reglas Generales*

1. 🤝 Respeto: Tratar a los demás miembros con respeto y cortesía.
2. 🚫 No spam: Evitar enviar mensajes repetitivos o innecesarios.
3. ❌ No publicidad: No compartir enlaces o promociones de productos/servicios.
4. 🙅 No discusiones personales: Mantener las conversaciones relacionadas con Minecraft.

*⚠️ Reglas de Contenido*

1. 🔞 Contenido adecuado: Evitar compartir contenido inapropiado, ofensivo o violento.
2. 🎬 No spoilers: No revelar información sobre actualizaciones o eventos sin permiso.
3. 🚫 No trucos/cheats: No compartir métodos para hacer trampa en el juego.

*🤝 Reglas de Interacción*

1. 🗣️ No insultos: Evitar insultos o comentarios despectivos hacia otros jugadores.
2. 🚫 No acoso: No acosar o molestar a otros miembros.
3. 🤝 Colaboración: Fomentar la colaboración y el trabajo en equipo.

*👮‍♂️ Reglas de Administración*

1. 🛡️ Administradores: Los administradores tienen la última palabra en decisiones.
2. ⚠️ Expulsión: Los miembros que violen las reglas pueden ser expulsados.
3. 📝 Actualizaciones: Los administradores pueden actualizar las reglas según sea necesario.`,
                imagePath: path.join(__dirname, 'images', 'comunidad.png')
            };
        case '.canales':
            return {
                text: '🚧 Estamos en proceso',
                imagePath: null
            };   
        case '.donar':
            return {
                text: '💖 https://streamlabs.com/kasuto358',
                imagePath: path.join(__dirname, 'images', 'donar.png')
            };
        case '.info':
            return {
                text: '🤖 Hola, soy un bot creado por Edwardofc para administrar Earthnovacraft',
                imagePath: null
            }; 
        case '.geynex':
            return {
                text: '😂 ya sabemos que nexar es gey',
                imagePath: null
            };          
    }
}

// Función para enviar imagen y texto juntos
async function sendImageWithText(chatId, response) {
    try {
        let media = null;
        
        // Verifica si la imagen existe y se puede enviar
        if (response.imagePath && fs.existsSync(response.imagePath)) {
            media = MessageMedia.fromFilePath(response.imagePath);
            console.log('📷 Imagen encontrada:', response.imagePath);
        } else {
            console.log('❌ No se encontró imagen para el comando.');
        }

        // Si se encontró la imagen, envía la imagen con el texto como pie de foto
        if (media) {
            await client.sendMessage(chatId, media, { caption: response.text });
        } else {
            await client.sendMessage(chatId, response.text);
        }
        console.log('✅ Mensaje enviado con éxito.');
    } catch (error) {
        console.error(`❌ Error al enviar el mensaje o imagen: ${error.message}`);
    }
}

// Evento para enviar mensaje de bienvenida cuando alguien se une al grupo
client.on('group_join', async (notification) => {
    const chat = await notification.getChat();
    const contact = await notification.getContact();

    await chat.sendMessage(`👋 ¡Bienvenido a la comunidad de EARTHNOVACRAFT, @${contact.number}! 🎉

Esperamos que disfrutes tu estancia en el grupo. Aquí podrás encontrar ayuda, charlar con otros miembros y pasar un buen rato. Usa *.menu* para ver los comandos disponibles. 💬`, {
        mentions: [contact]
    });

    console.log(`👋 Mensaje de bienvenida enviado a ${contact.number}`);
});

// Inicializar el cliente
client.initialize();  
