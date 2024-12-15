import { smsg } from './lib/simple.js';
import { fileURLToPath } from 'url';
import path from 'path';
import chalk from 'chalk';

const { proto } = (await import('@whiskeysockets/baileys')).default;

const isNumber = x => typeof x === 'number' && !isNaN(x);
const delay = ms => isNumber(ms) && new Promise(resolve => setTimeout(resolve, ms));

export async function handler(chatUpdate) {
    this.msgqueque = this.msgqueque || [];
    if (!chatUpdate) return;

    let m = chatUpdate.messages[chatUpdate.messages.length - 1];
    if (!m) return;

    if (global.db.data == null) await global.loadDatabase();

    try {
        m = smsg(this, m) || m;
        if (!m) return;

        m.exp = 0;
        m.corazones = false;

        // Manejo de usuarios
        let user = global.db.data.users[m.sender] || {};
        if (typeof user !== 'object') global.db.data.users[m.sender] = {};

        user.exp = user.exp || 0;
        user.corazones = user.corazones || 10;
        user.premium = user.premium || false;
        user.registered = user.registered || false;
        user.name = user.name || m.name;

        // Manejo de chats
        let chat = global.db.data.chats[m.chat] || {};
        if (typeof chat !== 'object') global.db.data.chats[m.chat] = {};

        chat.isBanned = chat.isBanned || false;
        chat.bienvenida = chat.bienvenida !== undefined ? chat.bienvenida : true; 

    } catch (e) {
        console.error(e);
    }

    // Lógica para procesar comandos
    if (!m.fromMe && global.opts['self']) return;

    // Procesar el texto del mensaje
    if (typeof m.text !== 'string') m.text = '';

    // Lógica para ejecutar plugins
    const ___dirname = path.join(path.dirname(fileURLToPath(import.meta.url)), './plugins');
    
    for (let name in global.plugins) {
        let plugin = global.plugins[name];
        
        if (!plugin || plugin.disabled) continue;

        if (typeof plugin.all === 'function') {
            try {
                await plugin.all.call(this, m, { chatUpdate, __dirname: ___dirname });
            } catch (e) {
                console.error(e);
            }
        }

        // Comprobar si el comando es aceptado por el plugin
        const str2Regex = str => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
        
        let _prefix = plugin.customPrefix ? plugin.customPrefix : conn.prefix ? conn.prefix : global.prefix;
        
        let match = (_prefix instanceof RegExp ?
            [[_prefix.exec(m.text), _prefix]] :
            Array.isArray(_prefix) ?
                _prefix.map(p => {
                    let re = p instanceof RegExp ? p : new RegExp(str2Regex(p));
                    return [re.exec(m.text), re];
                }) :
                typeof _prefix === 'string' ?
                    [[new RegExp(str2Regex(_prefix)).exec(m.text), new RegExp(str2Regex(_prefix))]] :
                    [[[], new RegExp]]
            ).find(p => p[1]);

        if (typeof plugin.before === 'function') {
            if (await plugin.before.call(this, m, { match })) continue; // Si hay un before y retorna true, continuar
        }

        if (typeof plugin !== 'function') continue;

        let usedPrefix;
        
        if ((usedPrefix = (match[0] || '')[0])) {
            let noPrefix = m.text.replace(usedPrefix, '');
            let [command, ...args] = noPrefix.trim().split` `.filter(v => v);
            args = args || [];
            command = (command || '').toLowerCase();

            let isAccept= plugin.command instanceof RegExp ?
                plugin.command.test(command) :
                Array.isArray(plugin.command) ?
                    plugin.command.some(cmd => cmd instanceof RegExp ? cmd.test(command) : cmd === command) :
                    typeof plugin.command === 'string' ?
                        plugin.command === command :
                        false;

            if (!isAccept) continue; // Si no acepta el comando, continuar

            // Ejecutar el comando del plugin
            try {
                await plugin.call(this, m, { match });
            } catch (e) {
                console.error(e);
                conn.reply(m.chat, `⚠️ Ocurrió un error al ejecutar el comando: ${format(e)}`, m);
            }
            break; // Salir del bucle después de ejecutar un comando
        }
    }
}

// Función para manejar fallos en los comandos
global.dfail= (type, m, conn)=> {
     let msg= {
         rowner: "```:⁖֟⊱┈֟፝❥ ¡¡ESTA FUNCIÓN SOLO PUEDE SER USADA POR MI CREADOR!!```", 
         owner: "```:⁖֟⊱┈֟፝❥ ¡¡ESTA FUNCIÓN SOLO PUEDE SER USADA POR MI DESARROLLADOR!!```", 
         mods: "```:⁖֟⊱┈֟፝❥ ¡¡ESTA FUNCIÓN SOLO PUEDE SER USADA POR MIS DESARROLLADORES!!```", 
         premium: "```:⁖֟⊱┈֟፝❥ ¡¡ESTA FUNCIÓN SOLO ES PARA USUARIOS PREMIUM!!```", 
         group: "```:⁖֟⊱┈֟፝❥ ¡¡ESTA FUNCION SOLO PUEDE SER EJECUTADA EN GRUPOS!!```", 
         private: "```:⁖֟⊱┈֟፝❥ ¡¡ESTA FUNCIÓN SOLO PUEDE SER USADA EN CHAT PRIVADO!!```", 
         admin: "```:⁖֟⊱┈֟፝❥ ¡¡ESTE COMANDO SOLO PUEDE SER USADO POR ADMINS!!```", 
         botAdmin: "```:⁖֟⊱┈֟፝❥ ¡¡PARA USAR ESTA FUNCIÓN DEBO SER ADMIN DEL GRUPO!!```", 
         unreg: "```:⁖֟⊱┈֟፝❥ ¡¡NECESITAS ESTAR REGISTRADO(A) PARA USAR ESTE COMANDO!!```",
         restrict: "```:⁖֟⊱┈֟፝❥ ¡¡ESTA CARACTERÍSTICA ESTA DESACTIVADA!!```"
     }[type];
     if(msg)
         return conn.reply(m.chat,msg,m).then(_=>m.react('✖️'));
}

let file= global.__filename(import.meta.url,true);
watchFile(file, async () => {
     unwatchFile(file);
     console.log(chalk.magenta("Se actualizo 'handler.js'"));
     if(global.reloadHandler)
         console.log(await global.reloadHandler());
});
