let handler = async (m, { conn }) => {
    let name = await conn.getName(m.sender);
    let imagenes = ["https://qu.ax/UNwcS.jpg"];
    
    let img = imagenes[Math.floor(Math.random() * imagenes.length)];
    
    let don = `*Bienvenid@ \`${name}\` a nuestra tienda virtual, donde podrás encontrar los precios ofrecidos por.*\n`;
    
    await m.react('🛒');
    
    conn.sendMessage(m.chat, {
        text: don,
        contextInfo: {
            externalAdReply: {
                title: '－ ＴＩＥＮＤＡ ＶＩＲＴＵＡＬ 🛒',
                body: '¡El servicio ideal para llevar tus proyectos al siguiente nivel!',
                thumbnailUrl: img,
                sourceUrl: 'https://',
                mediaType: 1,
                renderLargerThumbnail: true
            }
        }
    }, { quoted: m });
};

handler.help = ['shop'];
handler.tags = ['shop'];
handler.command = /^(shop|rangos)$/i;

export default handler;
