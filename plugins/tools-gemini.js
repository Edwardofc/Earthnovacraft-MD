import fetch from 'node-fetch';

let handler = async (m, { conn, text }) => {
    if (!text) return conn.reply(m.chat, `*🚩 Ingrese su petición*\n*🪼 Ejemplo de uso:* !gemini como hacer estrella de papel`, m);
    
    await m.react('💬');

    try {
        let apiUrl = `https://apis-starlights-team.koyeb.app/starlight/gemini?text=${encodeURIComponent(text)}`;
        
        let response = await fetch(apiUrl);
        let jsonResponse = await response.json();

        if (jsonResponse.status === 'true') {
            await conn.reply(m.chat, jsonResponse.result, m);
        } else {
            await m.react('✖️');
        }
        
    } catch (error) {
        console.error(error);
        await m.react('✖️');
    }
};

handler.help = ['gemini *<petición>*'];
handler.tags = ['tools'];
handler.command = ['gemini'];
handler.register = true;

export default handler;
