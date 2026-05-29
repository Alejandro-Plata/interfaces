# Plan de Implementación — Inventario ANBU (Ionic 8 + Angular 19)

> Plan paso a paso para construir la aplicación descrita en `caracteristicas.md`.
> **Restricciones obligatorias:**
> - **Ionic 8** sobre **Angular 19**.
> - **Sin signals** (estado en propiedades de clase + servicios; `@Input/@Output` clásicos).
> - **Standalone Components**, servicios e inyección básica.
> - **Gráficos con Chart.js** (Barras, Radar, Sectores) — solicitado explícitamente.
> - Exportación con **`xlsx`**, **`jspdf`**, **`jspdf-autotable`** (exigidas por el documento).
> - Estética sobria, temática **ANBU/Ninja**: fondo oscuro (`#0a0a0a`, `#1f1f1f`, `#1a1a1a`) con acentos en rojo carmesí (`#cc0000`).

---

## 0. Decisiones técnicas (resumen)

| Tema | Decisión | Motivo |
|------|----------|--------|
| Plataforma | Ionic 8 + Angular 19, standalone, sin routing inicial (una sola página) | Lo pides explícitamente |
| Estado | Propiedades de componente + `InventarioService` como única fuente de verdad | "Sin sistemas reactivos complejos" (línea 50 del enunciado) |
| Gráficos | **Chart.js** nativo (`chart.js` v4) sobre `<canvas>` con `ViewChild` + `ngAfterViewInit` | Pedido por ti; sin wrapper extra (no añado ng2-charts si no se solicita) |
| Exportación | `xlsx`, `jspdf`, `jspdf-autotable` | Exigidas (línea 95) |
| UI / controles | Componentes Ionic (`ion-card`, `ion-searchbar`, `ion-select`, `ion-button`...) | Coherencia con Ionic 8 |
| Tabla | `<table>` HTML propia dentro de `ion-content` | El enunciado muestra `<tr *ngFor>`; una tabla real facilita orden/paginación |
| Filtros | `ngModel` con `FormsModule` sobre controles Ionic | Simple, sin signals |

> ⚠️ **Compatibilidad jsPDF/autotable:** el enunciado usa `import autoTable from 'jspdf-autotable'; autoTable(doc, {...})` (API de **jsPDF 2.x + autotable 3.x**). Fijaremos `jspdf@^2.5.2` y `jspdf-autotable@^3.8.4` para que ese código funcione tal cual.
> ⚠️ **Chart.js v4** requiere registrar los controladores una vez: `Chart.register(...registerables)`.

---

## 1. Estructura de carpetas objetivo

```
anbu-inventory/
└── src/
    ├── app/
    │   ├── models/
    │   │   └── suministro.model.ts        # interface Suministro + tipos + SUMINISTROS_MOCK
    │   ├── services/
    │   │   ├── inventario.service.ts       # datos + getStats() + getMostFrequent()
    │   │   └── exportacion.service.ts       # exportarInventario('excel' | 'pdf')
    │   ├── components/
    │   │   ├── dashboard/                   # contenedor: ion-content + CSS Grid (.anbu-dashboard)
    │   │   ├── kpi-card/                     # ion-card KPI reutilizable (@Input)
    │   │   ├── grafico-barras/              # Chart.js type:'bar'
    │   │   ├── grafico-radar/               # Chart.js type:'radar'
    │   │   ├── grafico-sectores/            # Chart.js type:'doughnut' (sectores)
    │   │   └── tabla-inventario/            # tabla avanzada (filtros/orden/paginación/selección)
    │   ├── app.component.ts / .html         # ion-app shell, monta <app-dashboard>
    │   └── app.config.ts                     # provideIonicAngular(), sin routing
    ├── theme/
    │   └── variables.scss                    # paleta ANBU sobre variables --ion-*
    ├── global.scss                           # estilos globales (badges, stock-critico, kpi-card)
    └── main.ts                               # bootstrap + Chart.register(...registerables)
```

---

## 2. Fases de implementación (paso a paso)

### Fase 0 — Crear el proyecto (Ionic 8 + Angular 19)

**Ruta recomendada (fija ambas versiones con seguridad):** crear base Angular 19 y añadirle Ionic 8.
```powershell
npx @angular/cli@19 new anbu-inventory --style=scss --routing=false --ssr=false
cd anbu-inventory
npx ng add @ionic/angular@8
```
**Alternativa con Ionic CLI** (si la prefieres): `ionic start anbu-inventory blank --type=angular-standalone` y luego **fijar Angular a `^19`** en `package.json` + `npm i` (el template puede traer otra major de Angular).

Instalar dependencias del enunciado + Chart.js:
```powershell
npm i chart.js xlsx@^0.18.5 jspdf@^2.5.2 jspdf-autotable@^3.8.4
```

Verificaciones:
1. `provideIonicAngular()` presente en `app.config.ts` y `<ion-app>` en el shell.
2. `npm start` arranca en `localhost:4200` (o `ionic serve`).
3. Si el build avisa por tamaño de bundle (Ionic + Chart.js + xlsx + jspdf pesan), subir `budgets` en `angular.json` (p. ej. `maximumError` ≈ `2mb`) y el `anyComponentStyle` si hiciera falta.

**Checklist Fase 0:** proyecto Ionic 8 sobre Angular 19 arranca; `package.json` incluye `chart.js`, `xlsx`, `jspdf`, `jspdf-autotable`.

---

### Fase 1 — Modelo de datos y datos de prueba

Archivo: `src/app/models/suministro.model.ts`

- Copiar **literalmente** la `interface Suministro` y el array `SUMINISTROS_MOCK` (enunciado, líneas 24-45).
- Tipos auxiliares para filtros/orden:
  ```ts
  export type Categoria = Suministro['categoria'];
  export type Rango = Suministro['rangoRequerido'];
  export type OrdenCampo = keyof Suministro;
  export type OrdenDir = 'asc' | 'desc';
  ```

**Checklist Fase 1:** el modelo compila y exporta `Suministro` + `SUMINISTROS_MOCK`.

---

### Fase 2 — Servicio de inventario (datos + estadísticas)

Archivo: `src/app/services/inventario.service.ts`

- Implementar **tal cual** el servicio del enunciado (líneas 52-76): `suministros`, `getSuministros()`, `getStats()`, `getMostFrequent()`.
- `getStats()`: `totalStock`, `totalValor`, `bajoStock` (stock < 10), `categoriaPrincipal`.
- Única fuente de verdad: dashboard y tabla leen de aquí (cumple "Sincronización mediante servicios").
- `@Injectable({ providedIn: 'root' })`, inyección por constructor.

**Checklist Fase 2 (valores esperados con el mock):**
- `bajoStock = 3` → stock < 10: **S002** (8), **S004** (5), **S006** (3).
- `totalStock = 343` (150+8+120+5+45+3+12).
- `categoriaPrincipal = 'Sigilo'` → frecuencias Armamento 2 / Médico 2 / Sigilo 2 / Herramientas 1; el empate lo resuelve la reducción de `getMostFrequent` quedándose con **'Sigilo'**. Tenerlo presente al verificar el KPI.

---

### Fase 3 — Tema visual ANBU (variables Ionic + estilos globales)

Archivos: `src/theme/variables.scss` y `src/global.scss`

- En `variables.scss`, redefinir la paleta de Ionic en modo oscuro ANBU:
  ```scss
  :root {
    --ion-background-color: #0a0a0a;
    --ion-text-color: #e5e5e5;
    --ion-color-primary: #cc0000;        /* rojo carmesí */
    --ion-card-background: #1a1a1a;
    --ion-toolbar-background: #1f1f1f;
    --ion-border-color: #2a2a2a;

    /* tokens propios reutilizables */
    --anbu-surface: #1f1f1f;
    --anbu-card: #1a1a1a;
    --anbu-accent: #cc0000;
    --anbu-text-dim: #888;
    --anbu-critico: #ff3b3b;
  }
  ```
- En `global.scss`, definir clases compartidas: `.kpi-card` (línea 91, `border-left: 4px solid var(--anbu-accent)`), `.badge` + `.badge-genin/.badge-chunin/.badge-jonin/.badge-anbu`, `.stock-critico` (fila resaltada en rojo tenue).
- Sobriedad: rojo solo como acento (bordes, valores críticos, datasets), no como fondo dominante.

**Checklist Fase 3:** app en oscuro coherente; variables disponibles globalmente.

---

### Fase 4 — Layout del Dashboard (ion-content + CSS Grid)

Componente: `components/dashboard/` (importa los componentes Ionic que use: `IonHeader`, `IonToolbar`, `IonTitle`, `IonContent`).

- Shell: `ion-header > ion-toolbar` con título "PANEL DE COMANDO ANBU"; dentro de `ion-content`, un contenedor `.anbu-dashboard` con `grid-template-areas` (base del enunciado, líneas 82-89).
- ⚠️ **Adaptación declarada:** el grid de ejemplo solo define `chart-bar` y `chart-radar`, pero el objetivo pide **tres** gráficos. Extiendo el grid para incluir `chart-sectores`:
  ```css
  .anbu-dashboard {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-areas:
      "kpi1 kpi2 kpi3 kpi4"
      "chart-bar chart-bar chart-radar chart-sectores"
      "inventory inventory inventory inventory";
    gap: 1.5rem;
    padding: 1.5rem;
  }
  ```
- `DashboardComponent`: inyecta `InventarioService`; en `ngOnInit()` carga `stats` y `suministros` en propiedades locales (sin signals); renderiza 4 `<app-kpi-card>`, los 3 gráficos y `<app-tabla-inventario>`, cada uno asignado a su `grid-area`.
- Media query: en pantallas estrechas colapsar a 1-2 columnas.

**Checklist Fase 4:** áreas bien colocadas dentro de `ion-content`; responsive básico.

---

### Fase 5 — KPI Cards (componente reutilizable con `ion-card`)

Componente: `components/kpi-card/` (importa `IonCard`, `IonCardHeader`, `IonCardContent`).

- `@Input() titulo: string`, `@Input() valor: string | number`, `@Input() sufijo?: string` (`¥`), `@Input() critico = false`.
- Estilo `.kpi-card` del enunciado aplicado al `ion-card`.
- 4 instancias en el dashboard:
  1. **Stock Total** → `stats.totalStock`
  2. **Valor Total** → `stats.totalValor` + `¥`
  3. **Stock Crítico** → `stats.bajoStock` (`critico=true` si > 0)
  4. **Categoría Principal** → `stats.categoriaPrincipal`

**Checklist Fase 5:** los 4 KPIs muestran los valores del servicio.

---

### Fase 6 — Gráficos con Chart.js

Tres componentes, cada uno con su `<canvas #canvasRef>` y datos por `@Input()`.

**Registro global (una sola vez)** en `main.ts`:
```ts
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
Chart.defaults.color = '#e5e5e5';                 // texto claro para tema oscuro
Chart.defaults.borderColor = 'rgba(255,255,255,0.1)';
```

**Patrón común por componente (sin signals):**
```ts
@ViewChild('canvasRef') canvasRef!: ElementRef<HTMLCanvasElement>;
private chart?: Chart;

ngAfterViewInit() { this.render(); }
ngOnChanges() { if (this.chart) { this.actualizarDatos(); this.chart.update(); } }

private render() {
  this.chart = new Chart(this.canvasRef.nativeElement, { type, data, options });
}
```
- Envolver cada `<canvas>` en un `div` con altura fija y usar `options.responsive=true`, `maintainAspectRatio=false` (necesario dentro de `ion-content`).
- Reactividad a los datos vía `ngOnChanges` → `chart.update()` (cubre "reactivos a los datos").

**6a. `grafico-barras`** — `type: 'bar'`. Datos: valor de inventario (`stock*precioUnitario`) o stock **por categoría**. Dataset en carmesí.

**6b. `grafico-radar`** — `type: 'radar'`. Datos: stock por categoría (4 ejes: Armamento, Médico, Sigilo, Herramientas). Relleno carmesí translúcido.

**6c. `grafico-sectores`** — `type: 'doughnut'` (o `'pie'`). Datos: distribución de stock por categoría. Leyenda visible; paleta sobria con acento carmesí.

**Checklist Fase 6:** los tres gráficos pintan datos reales del mock, encajan en su `grid-area`, se redimensionan dentro de `ion-content` y se actualizan si cambian los datos.

---

### Fase 7 — Tabla de Inventario Avanzada (30% de la nota)

Componente: `components/tabla-inventario/` (importa `FormsModule` y los Ionic que use: `IonSearchbar`, `IonSelect`, `IonSelectOption`, `IonInput`, `IonButton`, `IonCheckbox`).

Estado local (propiedades, sin signals):
```ts
filtroTexto = '';                  // búsqueda por nombre (ion-searchbar)
filtroCategoria: '' | Categoria = '';
filtroRango: '' | Rango = '';
stockMin: number | null = null;    // filtro de rango (Consejo de Ninja)
stockMax: number | null = null;
ordenCampo: OrdenCampo = 'nombre';
ordenDir: OrdenDir = 'asc';
pagina = 1;
tamanoPagina = 5;                  // selector 5/10/25/50 ("paginación masiva")
seleccionados = new Set<string>(); // selección por id
filasVisibles: Suministro[] = [];  // resultado de recalcular()
```

`recalcular()` (llamado desde cada handler de filtro/orden/página): `datos → filtrar → ordenar → paginar`.
1. **Filtrado proactivo:** texto sobre `nombre` (case-insensitive), `categoria`, `rango`, y **rango numérico** `stockMin/stockMax` (cumple el "Consejo de Ninja"; ampliable a precio).
2. **Ordenación dinámica:** click en cabecera fija `ordenCampo` y alterna `ordenDir`; indicador ▲/▼ y `aria-sort`.
3. **Paginación:** `slice` sobre filtrado+ordenado; controles anterior/siguiente + total de páginas + selector de tamaño (con `ion-button`/`ion-select`).
4. **Selección:** `ion-checkbox` por fila (toggle en `seleccionados`) + "seleccionar todo (página)".
5. **Alerta visual:** `[class.stock-critico]="s.stock < 10"` en `<tr>` (línea 125).
6. **Badges de rango:** `[ngClass]="'badge-' + s.rangoRequerido.toLowerCase()"` (línea 128).
7. **Estado vacío:** mensaje cuando ningún registro cumple los filtros.

**Checklist Fase 7:** filtros combinados, orden por todas las columnas, paginación correcta, selección persistente entre páginas, filas críticas resaltadas, badges por rango.

---

### Fase 8 — Servicio de Exportación (PDF + Excel)

Archivo: `services/exportacion.service.ts`

- `exportarInventario(formato: 'excel' | 'pdf', data: Suministro[])` siguiendo el enunciado (líneas 101-119):
  - **Excel:** `XLSX.utils.json_to_sheet(data)` → `book_new` → `book_append_sheet(..., 'Suministros')` → `XLSX.writeFile(wb, 'Reporte_ANBU.xlsx')`.
  - **PDF:** `new jsPDF()`, título `'MANIFIESTO DE SUMINISTROS ANBU'`, `autoTable(doc, { startY, head, body })`, `doc.save('Manifiesto_Mision.pdf')`.
- Datos a exportar: el conjunto **filtrado** (o los **seleccionados** si hay selección; si no, todos). Mejora "Fidelidad de Exportación".
- Botones `ion-button` "Exportar Excel" / "Exportar PDF" en la cabecera de la tabla.

> ⚠️ **tsconfig:** si `import autoTable from 'jspdf-autotable'` da error de tipos, añadir en `tsconfig.json` → `compilerOptions`: `"esModuleInterop": true` y `"allowSyntheticDefaultImports": true`.

**Checklist Fase 8:** se descargan `Reporte_ANBU.xlsx` (columnas correctas) y `Manifiesto_Mision.pdf` (título + tabla legible).

---

### Fase 9 — Integración y sincronización

- `AppComponent` = `ion-app` que monta `<app-dashboard>`.
- `DashboardComponent` distribuye datos a KPIs y gráficos (`@Input`) y contiene `<app-tabla-inventario>`.
- Todos consumen `InventarioService` (única fuente). KPIs/gráficos = estadísticas **globales**; tabla = **vista filtrada**. Evidencia la "sincronización dashboard ↔ tabla mediante servicios".

**Checklist Fase 9:** un único origen de datos alimenta dashboard y tabla coherentemente.

---

### Fase 10 — Refinamiento estético ANBU

- Rojo carmesí solo como acento (toolbar, bordes, datasets, valores críticos).
- Hover sutil en filas; título y glifo ninja discretos.
- Estados vacíos y foco visible; `aria-sort` en cabeceras.
- Revisar contraste en tema oscuro (texto de Chart.js en claro ya configurado en Fase 6).

**Checklist Fase 10:** interfaz oscura, sobria, coherente y legible.

---

### Fase 11 — Verificación y cierre

1. `npm start` / `ionic serve` y probar en navegador (ruta dorada + casos límite):
   - Filtros combinados, orden por cada columna, cambio de tamaño de página, selección entre páginas.
   - Exportar Excel y PDF y abrir los archivos.
   - Filas con stock < 10 resaltadas y badges de rango visibles.
   - Gráficos correctos y redimensionando bien.
2. `npm run build` → ajustar `budgets` si el bundle excede (Fase 0).
3. Revisión final contra los **criterios de evaluación**.

---

## 3. Mapeo a los criterios de evaluación

| Criterio | Peso | Cubierto en |
|----------|------|-------------|
| Robustez de la Tabla (filtros, orden, selección) | 30% | Fase 7 (+ filtro de rango del Consejo de Ninja) |
| Calidad de Visualización (gráficos correctos y reactivos) | 25% | Fase 6 (Chart.js: barras, radar, sectores) |
| Fidelidad de Exportación (Excel + PDF) | 20% | Fase 8 (exporta vista filtrada/seleccionada) |
| Arquitectura Angular (standalone, servicios, DI) | 15% | Fases 0-2, 9 (Ionic 8 + Angular 19, sin signals) |
| Diseño y Estética (temática ANBU) | 10% | Fases 3, 4, 10 |

---

## 4. Comandos de referencia

```powershell
# Base Angular 19 + Ionic 8 (ruta recomendada)
npx @angular/cli@19 new anbu-inventory --style=scss --routing=false --ssr=false
cd anbu-inventory
npx ng add @ionic/angular@8

# Dependencias: Chart.js + exportación (versiones compatibles con la API del enunciado)
npm i chart.js xlsx@^0.18.5 jspdf@^2.5.2 jspdf-autotable@^3.8.4

# Generar estructura (standalone por defecto)
npx ng g s services/inventario
npx ng g s services/exportacion
npx ng g c components/dashboard
npx ng g c components/kpi-card
npx ng g c components/grafico-barras
npx ng g c components/grafico-radar
npx ng g c components/grafico-sectores
npx ng g c components/tabla-inventario

# Ejecutar / construir
npm start        # o: ionic serve
npm run build
```

---

## 5. Riesgos y notas

- **Versiones cruzadas Ionic 8 / Angular 19:** crear primero la base Angular 19 y añadir Ionic con `ng add @ionic/angular@8` evita que el template de Ionic arrastre otra major de Angular. Si usas `ionic start`, fija Angular a `^19` después.
- **Chart.js v4:** registrar `...registerables` una vez (Fase 6). Dentro de `ion-content`, usar contenedor de altura fija + `maintainAspectRatio:false` o el canvas no se dimensiona bien.
- **jsPDF/autotable:** mantener 2.x/3.x para que `autoTable(doc, {...})` funcione sin cambios.
- **Tamaño de bundle:** Ionic + Chart.js + xlsx + jspdf son pesados; prever subir `budgets` en `angular.json`.
- **Sin signals:** usar `ngOnInit`/`ngOnChanges`/`ngAfterViewInit`, propiedades de clase y `@Input/@Output`. No usar `signal()`, `computed()`, `input()`, `model()`.
- **Radar** es el gráfico más laborioso de afinar; si el tiempo aprieta, priorizar barras y sectores.
```
