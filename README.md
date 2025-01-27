# Sistema de Recopilación de Información del Sistema

Este proyecto es una herramienta de línea de comandos desarrollada en Node.js que recopila información detallada sobre el sistema operativo, hardware, aplicaciones instaladas y usuarios en sistemas Windows y macOS.

## Características

El sistema recopila información detallada sobre:

- Sistema Operativo
  - Versión y arquitectura
  - Estado de licencia (Windows)
  - Información de build (macOS)

- Hardware
  - Procesador (modelo, velocidad, núcleos)
  - Memoria RAM (total, disponible, uso)
  - Almacenamiento (discos, particiones, espacio)
  - Tarjetas gráficas
  - Interfaces de red

- Aplicaciones Instaladas
  - Nombre y versión
  - Fabricante
  - Fecha de instalación
  - Información adicional específica del sistema

- Usuarios del Sistema
  - Cuentas locales
  - Permisos y grupos
  - Estado de las cuentas

## Requisitos Previos

- Node.js 18.x o superior
- npm 9.x o superior
- Permisos de administrador (para algunas funcionalidades)

## Instalación

1. Clonar el repositorio:
   ```bash
   git clone [URL_DEL_REPOSITORIO]
   cd node-system-info
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

## Uso

### Ejecutar el programa

```bash
node index.js
```

### Opciones disponibles

- `--output-dir, -o`: Especifica el directorio de salida (por defecto: "informes")
- `--no-apps`: Omite la recopilación de información de aplicaciones
- `--quiet, -q`: Modo silencioso
- `--help, -h`: Muestra la ayuda
- `--version, -v`: Muestra la versión

### Ejemplos

Recopilar toda la información:
```bash
node index.js
```

Especificar directorio de salida:
```bash
node index.js --output-dir="mis_reportes"
```

Modo silencioso sin apps:
```bash
node index.js --quiet --no-apps
```

## Estructura del Proyecto

```
node-system-info/
│
├── package.json
├── index.js
├── src/
│   ├── systemInfo.js
│   ├── collectors/
│   │   ├── hardwareCollector.js
│   │   ├── osCollector.js
│   │   ├── appsCollector.js
│   │   └── usersCollector.js
│   └── utils/
│       └── fileHandler.js
```

## Generación de Ejecutables

Para crear ejecutables independientes:

```bash
npm run build
```

Los ejecutables se generarán en el directorio `dist/`.

## Contribuir

Las contribuciones son bienvenidas. Por favor, sigue estos pasos:

1. Haz fork del repositorio
2. Crea una rama para tu característica (`git checkout -b feature/AmazingFeature`)
3. Realiza tus cambios
4. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
5. Push a la rama (`git push origin feature/AmazingFeature`)
6. Abre un Pull Request

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## Autor

Jose Carlos Florez Vergara

## Agradecimientos

- Equipo de Node.js
- Contribuidores de systeminformation
- Comunidad de código abierto