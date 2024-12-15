import path from 'path';
import { toAudio } from './converter.js';
import chalk from 'chalk'; 
import fetch from 'node-fetch';
import PhoneNumber from 'awesome-phonenumber';
import fs from 'fs';
import { fileTypeFromBuffer } from 'file-type';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * @type {import('@whiskeysockets/baileys')}
 */
const {
    default: _makeWaSocket,
    makeWALegacySocket,
    proto,
    generateWAMessageFromContent,
    prepareWAMessageMedia
} = (await import('@whiskeysockets/baileys')).default;

export function makeWASocket(connectionOptions, options = {}) {
    /**
     * @type {import('@whiskeysockets/baileys').WASocket | import('@whiskeysockets/baileys').WALegacySocket}
     */
    let conn = (global.opts['legacy'] ? makeWALegacySocket : _makeWaSocket)(connectionOptions);

    let sock = Object.defineProperties(conn, {
        logger: {
            get() {
                return {
                    info(...args) {
                        console.log(
                            chalk.bold.bgRgb(51, 204, 51)('INFO '),
                            `[${chalk.rgb(255, 255, 255)(new Date().toUTCString())}]:`,
                            chalk.cyan(format(...args))
                        );
                    },
                    error(...args) {
                        console.log(
                            chalk.bold.bgRgb(247, 38, 33)('ERROR '),
                            `[${chalk.rgb(255, 255, 255)(new Date().toUTCString())}]:`,
                            chalk.rgb(255, 38, 0)(format(...args))
                        );
                    },
                    warn(...args) {
                        console.log(
                            chalk.bold.bgRgb(255, 153, 0)('WARNING '),
                            `[${chalk.rgb(255, 255, 255)(new Date().toUTCString())}]:`,
                            chalk.redBright(format(...args))
                        );
                    },
                    debug(...args) {
                        console.log(
                            chalk.bold.bgRgb(66, 167, 245)('DEBUG '),
                            `[${chalk.rgb(255, 255, 255)(new Date().toUTCString())}]:`,
                            chalk.white(format(...args))
                        );
                    }
                };
            },
            enumerable: true
        },
        getFile: {
            async value(PATH) {
                let data;
                if (Buffer.isBuffer(PATH)) data = PATH;
                else if (typeof PATH === 'string' && /^https?:\/\//.test(PATH)) data = await (await fetch(PATH)).buffer();
                else if (fs.existsSync(PATH)) data = fs.readFileSync(PATH);
                else throw new Error('Invalid input for getFile');

                if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer');
                const type = await fileTypeFromBuffer(data) || { mime: 'application/octet-stream', ext: '.bin' };
                
                return { data, ...type };
            },
            enumerable: true
        },
        sendFile: {
            async value(jid, path, filename = '', caption = '', quoted, options = {}) {
                let type = await conn.getFile(path);
                let { data: file } = type;

                const message = {
                    ...options,
                    caption,
                    [type.mime.startsWith('image/') ? 'image' : 'document']: { url: path },
                    mimetype: type.mime,
                    fileName: filename || path.split('/').pop()
                };

                return await conn.sendMessage(jid, message, { quoted });
            },
            enumerable: true
        }
    });

    return sock;
}
