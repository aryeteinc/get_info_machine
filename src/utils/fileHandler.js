const fs = require('fs').promises;
const path = require('path');

async function saveToFile(data, outputDir, filename) {
    try {
        // Crear directorio si no existe
        await fs.mkdir(outputDir, { recursive: true });
        
        // Ruta completa del archivo
        const filePath = path.join(outputDir, filename);
        
        // Guardar datos en formato JSON
        await fs.writeFile(
            filePath,
            JSON.stringify(data, null, 2),
            'utf8'
        );
        
        return filePath;
    } catch (error) {
        throw new Error(`Error guardando archivo: ${error.message}`);
    }
}

module.exports = { saveToFile };