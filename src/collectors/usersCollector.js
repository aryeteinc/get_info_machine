const { execSync } = require('child_process');
const os = require('os');

async function getWindowsUsers() {
    try {
        const users = [];
        const result = execSync('wmic useraccount get name,sid,disabled,passwordrequired /format:csv', { encoding: 'utf8' });
        
        const lines = result.trim().split('\n');
        const headers = lines[0].split(',');
        
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',');
            if (values.length === headers.length) {
                // Obtener información de grupos para el usuario
                try {
                    const userInfo = {
                        nombre: values[headers.indexOf('Name')],
                        sid: values[headers.indexOf('SID')],
                        deshabilitado: values[headers.indexOf('Disabled')].toLowerCase() === 'true',
                        requiere_password: values[headers.indexOf('PasswordRequired')].toLowerCase() === 'true'
                    };

                    // Obtener grupos del usuario
                    const groupResult = execSync(`net user "${userInfo.nombre}"`, { encoding: 'utf8' });
                    const groupLines = groupResult.split('\n');
                    for (const line of groupLines) {
                        if (line.includes('Local Group Memberships') || line.includes('Membresías de grupo local')) {
                            const groups = line.split('*').slice(1).map(g => g.trim()).filter(Boolean);
                            userInfo.grupos = groups;
                            break;
                        }
                    }

                    users.push(userInfo);
                } catch (e) {
                    // Si hay error al obtener grupos, continuar con el siguiente usuario
                    continue;
                }
            }
        }

        return {
            total_usuarios: users.length,
            usuarios: users
        };
    } catch (error) {
        return {
            error: `Error obteniendo usuarios de Windows: ${error.message}`,
            total_usuarios: 0,
            usuarios: []
        };
    }
}

async function getMacUsers() {
    try {
        const users = [];
        // Obtener lista de usuarios no del sistema (sin guion bajo al inicio)
        const result = execSync('dscl . list /Users | grep -v "^_"', { encoding: 'utf8' });
        const userList = result.trim().split('\n');

        for (const username of userList) {
            if (username) {
                try {
                    const userInfo = {
                        nombre: username,
                        uid: execSync(`id -u ${username}`, { encoding: 'utf8' }).trim(),
                        grupos: execSync(`groups ${username}`, { encoding: 'utf8' }).trim().split(' '),
                        es_admin: execSync(`dseditgroup -o checkmember -m ${username} admin`, { encoding: 'utf8' })
                            .toLowerCase().includes('yes')
                    };

                    // Verificar si la cuenta está activa
                    const shellResult = execSync(`dscl . -read /Users/${username} UserShell`, { encoding: 'utf8' });
                    userInfo.cuenta_activa = !shellResult.includes('/usr/bin/false');

                    users.push(userInfo);
                } catch (e) {
                    // Si hay error con un usuario, continuar con el siguiente
                    continue;
                }
            }
        }

        return {
            total_usuarios: users.length,
            usuarios: users
        };
    } catch (error) {
        return {
            error: `Error obteniendo usuarios de macOS: ${error.message}`,
            total_usuarios: 0,
            usuarios: []
        };
    }
}

async function collectUsersInfo() {
    return process.platform === 'win32' ? await getWindowsUsers() : await getMacUsers();
}

module.exports = { collectUsersInfo };