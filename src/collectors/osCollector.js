const si = require('systeminformation');
const { execSync } = require('child_process');
const os = require('os');

async function getWindowsLicenseInfo() {
    try {
        // Obtener información de licencia en Windows
        const command = 'powershell "Get-CimInstance SoftwareLicensingProduct | where {$_.PartialProductKey -and $_.Name -like \'Windows*\'} | select LicenseStatus,LicenseFamily,Description"';
        const result = execSync(command, { encoding: 'utf8' });

        const licenseInfo = {
            estado: result.includes('1') ? 'Activado' : 'No activado',
            tipo: 'Desconocido'
        };

        if (result.toUpperCase().includes('RETAIL')) {
            licenseInfo.tipo = 'Retail';
        } else if (result.toUpperCase().includes('OEM')) {
            licenseInfo.tipo = 'OEM';
        } else if (result.toUpperCase().includes('VOLUME')) {
            licenseInfo.tipo = 'Licencia por Volumen';
        }

        return licenseInfo;
    } catch (error) {
        return {
            estado: 'Error al obtener información',
            error: error.message
        };
    }
}

async function getMacOSLicenseInfo() {
    try {
        // En macOS, verificamos la versión del sistema
        const result = execSync('sw_vers', { encoding: 'utf8' });
        const lines = result.split('\n');
        const version = {};

        lines.forEach(line => {
            if (line.includes('ProductVersion')) {
                version.version = line.split(':')[1].trim();
            } else if (line.includes('BuildVersion')) {
                version.build = line.split(':')[1].trim();
            }
        });

        return version;
    } catch (error) {
        return {
            error: 'Error al obtener información de macOS'
        };
    }
}

async function collectOSInfo() {
    try {
        // Obtener información básica del sistema operativo
        const [osInfo, uuid] = await Promise.all([
            si.osInfo(),
            si.uuid()
        ]);

        const baseInfo = {
            sistema: osInfo.platform,
            nombre: osInfo.distro,
            version: osInfo.release,
            arquitectura: osInfo.arch,
            kernel: osInfo.kernel,
            hostname: os.hostname(),
            uuid: uuid.os
        };

        // Agregar información específica del sistema operativo
        if (process.platform === 'win32') {
            const licenseInfo = await getWindowsLicenseInfo();
            baseInfo.licencia = licenseInfo;
        } else if (process.platform === 'darwin') {
            const macInfo = await getMacOSLicenseInfo();
            baseInfo.version_macos = macInfo;
        }

        return baseInfo;

    } catch (error) {
        throw new Error(`Error obteniendo información del SO: ${error.message}`);
    }
}

module.exports = { collectOSInfo };