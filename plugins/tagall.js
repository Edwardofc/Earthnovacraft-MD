const handler = async (m, { isOwner, isAdmin, conn, text, participants, args }) => {
    if (!(isAdmin || isOwner)) {
        global.dfail('admin', m, conn);
        throw false;
    }

    const pesan = args.join` `;
    const oi = `*» INFO :* ${pesan}`;
    
    let teks = `*!  MENCION GENERAL  !*\n  *PARA ${participants.length} MIEMBROS* 🗣️\n\n ${oi}\n\n╭  ┄ 𝅄  ۪꒰ \`⡞᪲=͟͟͞🄶𝚎᪶۫۫𝚗᪶۫۫𝚎᪶۫۫𝚜᪶۫۫𝚒᪶۫۫𝚜᪶۫ 𝚊᪶۫𝚒᪶۫͜ ≼᳞ׄ\` ꒱  ۟  𝅄 ┄\n`;
    
    for (const mem of participants) {
        teks += `┊🤍 @${mem.id.split('@')[0]}\n`;
    }
    
    teks += `╰⸼ ┄ ┄ ┄ ─  ꒰  ׅ୭ *${global.vs}* ୧ ׅ ꒱  ┄  ─ ┄ ⸼`;
    
    conn.sendMessage(m.chat, { text: teks, mentions: participants.map((a) => a.id) });
};

handler.help = ['todos <mensaje>'];
handler.tags = ['grupo'];
handler.command = /^(tagall|invocar|marcar|todos|invocación)$/i;
handler.admin = true;
handler.group = true;

export default handler;