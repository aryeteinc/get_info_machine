const { execSync } = require('child_process');
const path = require('path');

// Función para obtener aplicaciones en Windows
async function getWindowsApps() {
    try {
        const apps = [];
        // En Windows, usamos PowerShell para obtener la lista de aplicaciones
        const command = 'powershell -command "Get-ItemProperty HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*, HKLM:\\Software\\Wow6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\* | Select-Object DisplayName, DisplayVersion, Publisher, InstallDate | Where-Object DisplayName -ne $null | ConvertTo-Json"';
        
        const result = execSync(command, { encoding: 'utf8' });
        const installedApps = JSON.parse(result);
        
        // Convertir el resultado a nuestro formato estándar
        (Array.isArray(installedApps) ? installedApps : [installedApps]).forEach(app => {
            if (app.DisplayName) {
                apps.push({
                    nombre: app.DisplayName,
                    version: app.DisplayVersion || 'Desconocida',
                    fabricante: app.Publisher || 'Desconocido',
                    fecha_instalacion: app.InstallDate || 'Desconocida'
                });
            }
        });

        return {
            total_apps: apps.length,
            apps: apps.sort((a, b) => a.nombre.localeCompare(b.nombre))
        };
    } catch (error) {
        return {
            error: `Error obteniendo aplicaciones de Windows: ${error.message}`,
            total_apps: 0,
            apps: []
        };
    }
}

// Función para obtener aplicaciones en macOS
async function getMacApps() {
    try {
        const apps = [];
        const appDirectories = ['/Applications', path.join(process.env.HOME, '/Applications')];

        for (const dir of appDirectories) {
            try {
                const command = `find "${dir}" -name "*.app" -maxdepth 1`;
                const result = execSync(command, { encoding: 'utf8' });
                
                const appPaths = result.split('\n').filter(Boolean);
                
                for (const appPath of appPaths) {
                    try {
                        const appName = path.basename(appPath, '.app');
                        const plistPath = path.join(appPath, 'Contents/Info.plist');
                        
                        // Intentar obtener información adicional del plist
                        try {
                            const plistCommand = `plutil -convert json -o - "${plistPath}"`;
                            const plistData = execSync(plistCommand, { encoding: 'utf8' });
                            const info = JSON.parse(plistData);
                            
                            apps.push({
                                nombre: info.CFBundleDisplayName || info.CFBundleName || appName,
                                version: info.CFBundleShortVersionString || 'Desconocida',
                                identificador: info.CFBundleIdentifier || 'Desconocido',
                                fabricante: info.CFBundleVendor || path.basename(dir)
                            });
                        } catch {
                            // Si no podemos leer el plist, agregar información básica
                            apps.push({
                                nombre: appName,
                                version: 'Desconocida',
                                identificador: 'Desconocido',
                                fabricante: path.basename(dir)
                            });
                        }
                    } catch (e) {
                        continue; // Continuar con la siguiente aplicación si hay error
                    }
                }
            } catch (e) {
                continue; // Continuar con el siguiente directorio si hay error
            }
        }

        return {
            total_apps: apps.length,
            apps: apps.sort((a, b) => a.nombre.localeCompare(b.nombre))
        };
    } catch (error) {
        return {
            error: `Error obteniendo aplicaciones de macOS: ${error.message}`,
            total_apps: 0,
            apps: []
        };
    }
}

// Función principal que determina qué sistema operativo usar
async function collectAppsInfo() {
    return process.platform === 'win32' ? await getWindowsApps() : await getMacApps();
}

// Exportar la función principal
module.exports = {
    collectAppsInfo
};