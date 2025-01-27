const si = require('systeminformation');
const os = require('os');
const path = require('path');
const { collectOSInfo } = require('./collectors/osCollector');
const { collectHardwareInfo } = require('./collectors/hardwareCollector');
const { collectAppsInfo } = require('./collectors/appsCollector');
const { collectUsersInfo } = require('./collectors/usersCollector');
const { saveToFile } = require('./utils/fileHandler');

class SystemInfoCollector {
    constructor() {
        this.platform = process.platform;
    }

    async collectAllInfo() {
        try {
            // Recopilar toda la información del sistema
            const osInfo = await collectOSInfo();
            const hardwareInfo = await collectHardwareInfo();
            const appsInfo = await collectAppsInfo();
            const usersInfo = await collectUsersInfo();

            // Construir el objeto de información completo
            const systemInfo = {
                fecha_recopilacion: new Date().toISOString(),
                sistema_operativo: osInfo,
                hardware: hardwareInfo,
                aplicaciones_instaladas: appsInfo,
                usuarios: usersInfo,
                timestamp: {
                    fecha: new Date().toLocaleDateString(),
                    hora: new Date().toLocaleTimeString(),
                    zona_horaria: Intl.DateTimeFormat().resolvedOptions().timeZone
                }
            };

            return systemInfo;

        } catch (error) {
            throw new Error(`Error recopilando información del sistema: ${error.message}`);
        }
    }

    async saveInfo(outputDir = 'informes') {
        try {
            const info = await this.collectAllInfo();
            const hostname = os.hostname();
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `system_info_${hostname}_${timestamp}.json`;
            
            const savedFile = await saveToFile(info, outputDir, filename);
            return savedFile;
        } catch (error) {
            throw new Error(`Error guardando información: ${error.message}`);
        }
    }
}

module.exports = SystemInfoCollector;