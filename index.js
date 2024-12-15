console.log('🚀 Iniciando...');

import { join } from 'path';
import { createRequire } from 'module';
import os from 'os';
import cluster from 'cluster'; // Importar el módulo cluster
import cfonts from 'cfonts';
import readline from 'readline';

// Definir __dirname para ES Modules
const __dirname = join(process.cwd(), './');
const requireModule = createRequire(__dirname);

// Mostrar el nombre del bot
cfonts.say('Earthnovacraft Bot', {
    font: 'block',
    align: 'center',
    colors: ['magenta', 'cyan']
});

// Lógica de clustering
if (cluster.isPrimary) {
    const cpuCount = os.cpus().length; // Contar núcleos de CPU
    console.log(`Número total de CPUs: ${cpuCount}`);

    // Crear un proceso hijo por cada núcleo
    for (let i = 0; i < cpuCount; i++) {
        const worker = cluster.fork();
        console.log(`Trabajador ${worker.process.pid} creado.`);
        
        worker.on('exit', (code) => {
            console.error(`El trabajador ${worker.process.pid} terminó con el código: ${code}`);
            // Aquí puedes decidir si reiniciar el trabajador o no.
        });
    }
} else {
    // Iniciar el archivo principal en los trabajadores
    import('./main/main.js').catch(err => console.error('Error al iniciar main.js:', err));
}
