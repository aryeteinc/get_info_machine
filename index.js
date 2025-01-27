const SystemInfoCollector = require('./src/systemInfo');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const path = require('path');

// Configuración de los colores para la consola
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    red: '\x1b[31m'
};

// Función para mostrar el progreso en la consola
function showProgress(message) {
    console.log(`${colors.blue}${colors.bright}→${colors.reset} ${message}`);
}

// Función para mostrar el éxito en la consola
function showSuccess(message) {
    console.log(`${colors.green}${colors.bright}✓${colors.reset} ${message}`);
}

// Función para mostrar errores en la consola
function showError(message) {
    console.error(`${colors.red}${colors.bright}✗${colors.reset} ${message}`);
}

// Función para mostrar el encabezado del programa
function showHeader() {
    console.log('\n' + colors.bright + '='.repeat(50));
    console.log('   Sistema de Recopilación de Información');
    console.log('='.repeat(50) + colors.reset + '\n');
}

async function main() {
    try {
        // Configurar argumentos de línea de comandos
        const argv = yargs(hideBin(process.argv))
            .option('output-dir', {
                alias: 'o',
                description: 'Directorio de salida para los reportes',
                default: 'informes'
            })
            .option('no-apps', {
                description: 'No recopilar información de aplicaciones instaladas',
                type: 'boolean',
                default: false
            })
            .option('quiet', {
                alias: 'q',
                description: 'Modo silencioso - sin mensajes de progreso',
                type: 'boolean',
                default: false
            })
            .help()
            .alias('help', 'h')
            .version()
            .alias('version', 'v')
            .argv;

        // Mostrar encabezado si no estamos en modo silencioso
        if (!argv.quiet) {
            showHeader();
        }

        // Crear instancia del recolector
        const collector = new SystemInfoCollector();

        // Mostrar progreso si no estamos en modo silencioso
        if (!argv.quiet) {
            showProgress('Iniciando recopilación de información del sistema...');
        }

        // Recopilar y guardar la información
        const outputFile = await collector.saveInfo(argv['output-dir']);

        // Mostrar mensaje de éxito si no estamos en modo silencioso
        if (!argv.quiet) {
            showSuccess(`Información guardada exitosamente en: ${outputFile}`);
            
            // Mostrar mensaje sobre cómo ver los resultados
            console.log('\nPuede encontrar los resultados en:');
            console.log(`${colors.bright}${path.resolve(outputFile)}${colors.reset}`);
            console.log('\nEl archivo contiene información detallada sobre:');
            console.log('- Sistema operativo y estado de licencia');
            console.log('- Hardware (CPU, memoria, discos, etc.)');
            console.log('- Usuarios y sus permisos');
            if (!argv['no-apps']) {
                console.log('- Aplicaciones instaladas');
            }
        }

    } catch (error) {
        // Mostrar error y salir con código de error
        showError(`Error: ${error.message}`);
        process.exit(1);
    }

    // Si estamos en Windows y el programa se ejecutó haciendo doble clic,
    // mantener la ventana abierta
    if (process.platform === 'win32' && process.stdout.isTTY === false) {
        console.log('\nPresione cualquier tecla para salir...');
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.on('data', process.exit.bind(process, 0));
    }
}

// Ejecutar el programa
main();