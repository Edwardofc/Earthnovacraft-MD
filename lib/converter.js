import { promises } from 'fs';
import { join } from 'path';
import { spawn } from 'child_process';

/**
 * Función para ejecutar ffmpeg con los parámetros dados.
 * @param {Buffer} buffer - El buffer de entrada.
 * @param {Array} args - Argumentos adicionales para ffmpeg.
 * @param {String} ext - Extensión del archivo de entrada.
 * @param {String} ext2 - Extensión del archivo de salida.
 * @returns {Promise<Object>} - Promesa que resuelve con los datos del archivo convertido.
 */
function ffmpeg(buffer, args = [], ext = '', ext2 = '') {
    return new Promise(async (resolve, reject) => {
        try {
            let tmp = join(global.__dirname(import.meta.url), '../tmp', +new Date + '.' + ext);
            let out = tmp + '.' + ext2;
            await promises.writeFile(tmp, buffer);
            const process = spawn('ffmpeg', [
                '-y',
                '-i', tmp,
                ...args,
                out
            ]);

            process.on('error', reject);
            process.on('close', async (code) => {
                try {
                    await promises.unlink(tmp);
                    if (code !== 0) return reject(code);
                    resolve({
                        data: await promises.readFile(out),
                        filename: out,
                        delete: () => promises.unlink(out)
                    });
                } catch (e) {
                    reject(e);
                }
            });
        } catch (e) {
            reject(e);
        }
    });
}

/**
 * Convierte un buffer a formato PTT (Push To Talk).
 * @param {Buffer} buffer - El buffer de entrada.
 * @param {String} ext - Extensión del archivo de entrada.
 * @returns {Promise<Object>} - Promesa que resuelve con los datos del archivo convertido.
 */
function toPTT(buffer, ext) {
    return ffmpeg(buffer, [
        '-vn',
        '-c:a', 'libopus',
        '-b:a', '128k',
        '-vbr', 'on',
    ], ext, 'ogg');
}

/**
 * Convierte un buffer a formato de audio.
 * @param {Buffer} buffer - El buffer de entrada.
 * @param {String} ext - Extensión del archivo de entrada.
 * @returns {Promise<Object>} - Promesa que resuelve con los datos del archivo convertido.
 */
function toAudio(buffer, ext) {
    return ffmpeg(buffer, [
        '-vn',
        '-c:a', 'libopus',
        '-b:a', '128k',
        '-vbr', 'on',
        '-compression_level', '10'
    ], ext, 'opus');
}

/**
 * Convierte un buffer a formato de video.
 * @param {Buffer} buffer - El buffer de entrada.
 * @param {String} ext - Extensión del archivo de entrada.
 * @returns {Promise<Object>} - Promesa que resuelve con los datos del archivo convertido.
 */
function toVideo(buffer, ext) {
    return ffmpeg(buffer, [
        '-c:v', 'libx264',
        '-c:a', 'aac',
        '-ab', '128k',
        '-ar', '44100',
        '-crf', '32',
        '-preset', 'slow'
    ], ext, 'mp4');
}

export { toAudio, toPTT, toVideo };
