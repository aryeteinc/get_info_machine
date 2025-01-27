const si = require('systeminformation');

async function collectHardwareInfo() {
    try {
        // Recopilar información de hardware en paralelo para mejor rendimiento
        const [cpu, mem, disks, graphics, net] = await Promise.all([
            si.cpu(),
            si.mem(),
            si.diskLayout(),
            si.graphics(),
            si.networkInterfaces()
        ]);

        // Procesar información del CPU
        const cpuInfo = {
            fabricante: cpu.manufacturer,
            marca: cpu.brand,
            modelo: cpu.model,
            velocidad: {
                base: cpu.speed,
                max: cpu.speedMax,
                min: cpu.speedMin
            },
            nucleos: {
                fisicos: cpu.cores,
                logicos: cpu.physicalCores
            },
            cache: {
                l1d: cpu.cache.l1d,
                l1i: cpu.cache.l1i,
                l2: cpu.cache.l2,
                l3: cpu.cache.l3
            }
        };

        // Procesar información de memoria
        const memInfo = {
            total_gb: Math.round(mem.total / (1024 * 1024 * 1024) * 100) / 100,
            libre_gb: Math.round(mem.free / (1024 * 1024 * 1024) * 100) / 100,
            usado_gb: Math.round(mem.used / (1024 * 1024 * 1024) * 100) / 100,
            porcentaje_uso: Math.round((mem.used / mem.total) * 100 * 100) / 100
        };

        // Procesar información de discos
        const disksInfo = disks.map(disk => ({
            dispositivo: disk.device,
            tipo: disk.type,
            fabricante: disk.vendor,
            modelo: disk.name,
            numero_serie: disk.serialNum,
            tamanio_gb: Math.round(disk.size / (1024 * 1024 * 1024) * 100) / 100,
            interfaz: disk.interfaceType
        }));

        // Procesar información de tarjetas gráficas
        const graphicsInfo = {
            controladores: graphics.controllers.map(controller => ({
                modelo: controller.model,
                fabricante: controller.vendor,
                vram_mb: controller.vram,
                driver: controller.driverVersion
            })),
            displays: graphics.displays.map(display => ({
                modelo: display.model,
                fabricante: display.vendor,
                resolucion: `${display.resolutionX}x${display.resolutionY}`,
                tasa_refresco: display.refreshRate
            }))
        };

        // Procesar información de red
        const networkInfo = net.map(interface => ({
            nombre: interface.iface,
            tipo: interface.type,
            mac: interface.mac,
            velocidad: interface.speed,
            dhcp: interface.dhcp,
            ipv4: interface.ip4,
            ipv6: interface.ip6,
            estado: interface.operstate
        }));

        // Retornar toda la información de hardware
        return {
            procesador: cpuInfo,
            memoria: memInfo,
            almacenamiento: disksInfo,
            graficos: graphicsInfo,
            red: networkInfo
        };

    } catch (error) {
        throw new Error(`Error recopilando información de hardware: ${error.message}`);
    }
}

module.exports = { collectHardwareInfo };