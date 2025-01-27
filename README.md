# Sistema de Recopilación de Información del Sistema

Este proyecto es una herramienta de línea de comandos desarrollada en Node.js que recopila información detallada sobre el sistema operativo, hardware, aplicaciones instaladas y usuarios en sistemas Windows y macOS.

## Requisitos del Sistema

### Node.js y npm
Este proyecto ha sido desarrollado y probado con las siguientes versiones:
- **Node.js:** v18.20.4
- **npm:** v10.7.0

Para verificar tus versiones, ejecuta:
```bash
node -v
npm -v
```

Si necesitas actualizar o instalar estas versiones específicas:

Para Node.js v18.20.4:
```bash
# Usando nvm (recomendado)
nvm install 18.20.4
nvm use 18.20.4

# O descarga el instalador directamente de nodejs.org
```

Para npm v10.7.0:
```bash
npm install -g npm@10.7.0
```

### Sistema Operativo
- **Windows:** Windows 10 o superior (64-bit)
- **macOS:** macOS 10.15 (Catalina) o superior

### Requerimientos adicionales
- Permisos de administrador (para acceder a información del sistema)
- Mínimo 100MB de espacio en disco
- 2GB de RAM recomendado

## Instalación

1. Asegúrate de tener las versiones correctas de Node.js y npm:
   ```bash
   node -v  # Debería mostrar v18.20.4
   npm -v   # Debería mostrar 10.7.0
   ```

2. Clona el repositorio:
   ```bash
   git clone [URL_DEL_REPOSITORIO]
   cd node-system-info
   ```

3. Instala las dependencias:
   ```bash
   npm install
   ```

[... resto del README anterior ...]