# Librerías de terceros

Prevención en Terreno usa estas librerías libres. Cada una conserva su propia licencia.

1. **pdf-lib** (`pdf-lib.min.js`): genera los PDF.
   - Licencia MIT. Copyright (c) 2019 Andrew Dillon. https://github.com/Hopding/pdf-lib
   - Incluye **tslib** (Microsoft Corporation, licencia 0BSD/Apache 2.0) y **pako** (licencia MIT).

2. **SheetJS Community Edition 0.20.3** (`xlsx.full.min.js`): lee el listado de personal y el programa en Excel. Va junto a la app (funciona sin internet).
   - Licencia Apache 2.0. Copyright (C) 2012-present SheetJS LLC. https://sheetjs.com
   - Descargada de https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js
     (SHA-256 `cc015130aa8521e7f088f88898eba949ccdcbfb38df0bd129b44b7273c3a6f41`). Corrige CVE-2023-30533 y CVE-2024-22363 de la 0.18.5.

Estas licencias son compatibles con la GNU GPL v3 de este proyecto.
