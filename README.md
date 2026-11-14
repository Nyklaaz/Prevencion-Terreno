# Prevención en Terreno

**Herramienta gratuita y de código abierto para prevencionistas (APR).** Sirve para dejar el papel en terreno: los registros se llenan y firman en el celular, se guardan en PDF y funcionan **sin internet**.

## Qué hace

- **Charla diaria + ART** por departamento, con lista de asistentes, firmas en pantalla, fotos y PDF listo para compartir.
- **IRL – Información de Riesgos Laborales** (art. 15 del DS 44) por cargo, con PTS, HDS y documentos marcados, IRL adicionales para quien cumple más de un cargo y complemento de conductor.
- **Check list** de maquinaria, herramientas, instalaciones y señalización, con fotos y observaciones obligatorias cuando algo no cumple.
- **Informe mensual** (formato MOP): estadística acumulada, tasas e índices, nómina de accidentados, IFOS SAFI en Excel y una carpeta del mes con PDF, Word, Excel, registros y anexos.
- **Calendario y programa anual**: qué se hizo cada día, programa de prevención (también desde Excel o carta Gantt) con recordatorios, ticket de cumplimiento y porcentaje que pasa solo al informe mensual.
- **Hallazgos y acciones**: seguimiento con responsable, plazo, fotos antes/después, cierre y PDF de seguimiento. Las observaciones de un check list pasan a seguimiento con un toque.
- **Vencimientos**: licencias, exámenes, cursos, reinducciones IRL, extintores y revisiones técnicas, con aviso antes de que venzan.
- **Folio de verificación** en cada PDF: la app dice si un documento es el original o si fue modificado.
- **Asistente de riesgos sin internet**: en la ART sugiere peligros, riesgos, medidas y EPP según la tarea, y avisa lo que parece faltar. También revisa las IRL.
- **Editor de formatos**: IRL desde Word (.docx), charla y ART por departamento, textos de la charla y check list, todo dentro de la app.
- **Historial** de todos los PDF en el equipo, respaldo y traspaso del celular al PC.

## Cómo se usa

1. Abre la app en el navegador e instálala: menú del navegador → **"Instalar app"** o **"Agregar a pantalla de inicio"**.
2. La primera vez aparece **en blanco**. Entra a **Empresa y formatos** y completa el nombre, el RUT y el logo.
3. Crea tus formatos en el **Editor de formatos** (sube el Word de cada IRL, arma tus departamentos y check list) o carga un **paquete de empresa** (archivo `.json`).
4. Exporta tu paquete y pásaselo a tus supervisores: lo cargan una vez y todos trabajan con los mismos formatos.

## Privacidad

- Todo se guarda **solo en el equipo**: los registros, las firmas y el listado de personal. La app no tiene servidor y no envía datos a ninguna parte.
- Los formatos de cada empresa viajan en su propio paquete, **no** en este repositorio.
- Usa bloqueo de pantalla en los equipos y guarda los respaldos en un lugar seguro.

## Archivos

| Archivo | Para qué |
|---|---|
| `index.html` | La app completa: pantallas, estilos y lógica |
| `pdf-lib.min.js` | Librería que arma los PDF |
| `xlsx.full.min.js` | Librería que lee los Excel (listado de personal y programa) |
| `plantillas.js` | Plantillas Excel del informe mensual y del IFOS SAFI, sin datos de empresas |
| `sw.js` | Modo sin internet: guarda la app en el equipo |
| `manifest.json`, `icono-*.png` | Datos para instalarla como app |

Para publicar tu propia copia, sube estos archivos a un repositorio y actívalo en **GitHub Pages**.

## Licencia

Software libre bajo la **GNU GPL v3**. Puedes usarlo, copiarlo, modificarlo y compartirlo gratis. Si distribuyes una versión modificada, también debe ser libre y con su código disponible. Ver `LICENSE`.

Las librerías de terceros mantienen sus licencias: ver `TERCEROS.md`.

## Colaborar

¿Encontraste un error o tienes una idea? Abre un *issue* en este repositorio. Las mejoras son bienvenidas, para que sea la mejor herramienta gratuita de prevención.
