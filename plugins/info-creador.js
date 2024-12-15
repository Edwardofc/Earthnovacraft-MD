import fetch from 'node-fetch';

let handler = async (m, { conn }) => {
    m.react('🤍');

    let fkontak = { 
        "key": { 
            "participants": "0@s.whatsapp.net", 
            "remoteJid": "status@broadcast", 
            "fromMe": false, 
            "id": "Halo" 
        }, 
        "message": { 
            "contactMessage": { 
                "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Edward;;;\nFN:Edward\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` 
            }
        }, 
        "participant": "0@s.whatsapp.net" 
    };

    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;
    let edtr = `@${m.sender.split`@`[0]}`;

    let vcard = `BEGIN:VCARD\nVERSION:3.0\nN:Edward;;;\nFN:Edward\nitem1.TEL;waid=51997384622:+51 997 384 622\nitem1.Ed:📞 WhatsApp Owner\nitem2.URL:https://github.com/Edwardofc\nitem2.Atro:💬 GitHub\nitem3.EMAIL;type=INTERNET:ed0099@proton.me\nitem3.Atro:💌 Correo\nitem4.ADR:;;🇵🇪 Perú;;;;\nitem4.Ed:💬 Localización\nEND:VCARD`;

    const tag_own = await conn.sendMessage(m.chat, { contacts: { displayName: 'Creador', contacts: [{ vcard }] }}, { quoted: fkontak });
    
    let caption = `*👋 Hola ${edtr}, este es el contacto de mi creador 🤍*`;
    
    await conn.reply(m.chat, caption, tag_own, { mentions: conn.parseMention(caption) });
};

handler.help = ['owner', 'creator'];
handler.tags = ['main'];
handler.command = /^(owner|creator|creador|dueño)$/i;

export default handler;
