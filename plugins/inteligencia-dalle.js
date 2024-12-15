import fetch from 'node-fetch';

let handler = async (m, { conn, text }) => {
    if (!text) throw m.reply(`El comando necesita una descripción para empezar a dibujar.\n\n *✧ Ejemplo:* !dalle Wooden house on snow mountain`);
    
    await m.reply('🔄 Procesando tu solicitud...');

    try {
        let url = `https://widipe.com/dalle?text=${encodeURIComponent(text)}`;
        
        await conn.sendFile(m.chat, await (await fetch(url)).buffer(), 'dalle.jpg', 'Aquí tienes tu imagen generada:', m);
        m.react('✅');
        
    } catch (e) {
        console.error(e);
        conn.reply(m.chat, '⚠️ Ocurrió un error al procesar tu solicitud.', m);
        await m.react('✖️');
    }
};

handler.help = ['dalle <txt>'];
handler.tags = ['ai'];
handler.command = /^(dalle)$/i;

export default handler;
