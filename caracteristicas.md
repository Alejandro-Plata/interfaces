Objetivos de la Misión
Al completar esta práctica, el aspirante habrá dominado:

Visualización Analítica: Implementación de Dashboards con múltiples tipos de gráficos (Barras, Radar, Sectores).
Tablas de Datos Avanzadas: Filtrado proactivo, ordenación dinámica y paginación masiva.
Exportación Dual: Generación de reportes de auditoría en PDF y hojas de cálculo en Excel (XLSX).
Gestión de Datos: Sincronización de información entre el dashboard y la tabla de inventario mediante servicios.
Arquitectura de Flujo de Datos
Base de Datos de Suministros

Servicio Angular de Inventario

Gestión de Datos: Propiedades / Arrays

Tabla Avanzada: Visualización y Filtros

Gráficos: Telemetría en Tiempo Real

Motor de Exportación: PDF y Excel

Estructura de Datos (Schema)
Para esta misión, trabajaremos con un modelo de datos robusto que incluye metadatos de clasificación ninja y control de existencias.

export interface Suministro {
  id: string;
  nombre: string;
  categoria: 'Armamento' | 'Médico' | 'Sigilo' | 'Herramientas';
  stock: number;
  precioUnitario: number;
  rangoRequerido: 'Genin' | 'Chunin' | 'Jonin' | 'Anbu';
  ultimaActualizacion: string; // Formato ISO
}

Datos de Prueba para la Misión
Utilice este conjunto de datos para alimentar su servicio inicial:

export const SUMINISTROS_MOCK: Suministro[] = [
  { id: 'S001', nombre: 'Kuna de Acero', categoria: 'Armamento', stock: 150, precioUnitario: 15, rangoRequerido: 'Genin', ultimaActualizacion: '2024-03-01' },
  { id: 'S002', nombre: 'Píldoras de Soldado', categoria: 'Médico', stock: 8, precioUnitario: 50, rangoRequerido: 'Chunin', ultimaActualizacion: '2024-03-05' },
  { id: 'S003', nombre: 'Bomba de Humo', categoria: 'Sigilo', stock: 120, precioUnitario: 25, rangoRequerido: 'Anbu', ultimaActualizacion: '2024-03-02' },
  { id: 'S004', nombre: 'Pergamino de Sellado', categoria: 'Herramientas', stock: 5, precioUnitario: 200, rangoRequerido: 'Jonin', ultimaActualizacion: '2024-03-08' },
  { id: 'S005', nombre: 'Shuriken Gigante', categoria: 'Armamento', stock: 45, precioUnitario: 80, rangoRequerido: 'Chunin', ultimaActualizacion: '2024-03-04' },
  { id: 'S006', nombre: 'Ungüento Curativo', categoria: 'Médico', stock: 3, precioUnitario: 120, rangoRequerido: 'Genin', ultimaActualizacion: '2024-03-07' },
  { id: 'S007', nombre: 'Capa de Invisibilidad', categoria: 'Sigilo', stock: 12, precioUnitario: 500, rangoRequerido: 'Anbu', ultimaActualizacion: '2024-03-01' }
];

Guía de Implementación
Servicio de Gestión de Datos y Estadísticas

Implemente un servicio que centralice la información y calcule las métricas necesarias para el Dashboard. Al no usar sistemas reactivos complejos, el componente deberá solicitar los datos al servicio para actualizar su estado local.

import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class InventarioService {
  public suministros: Suministro[] = SUMINISTROS_MOCK;

  getSuministros() { return this.suministros; }

  getStats() {
    return {
      totalStock: this.suministros.reduce((acc, s) => acc + s.stock, 0),
      totalValor: this.suministros.reduce((acc, s) => acc + (s.stock * s.precioUnitario), 0),
      bajoStock: this.suministros.filter(s => s.stock < 10).length,
      categoriaPrincipal: this.getMostFrequent(this.suministros.map(s => s.categoria))
    };
  }

  private getMostFrequent(arr: string[]) {
    const counts = arr.reduce((acc: any, val) => {
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
  }
}

Dashboard Analítico (CSS Grid)

Utilice un layout de áreas para organizar los KPIs y los gráficos. Esto permite una visualización clara de la telemetría antes de profundizar en la tabla de datos.

.anbu-dashboard {
  display: grid;
  grid-template-areas:
    "kpi1 kpi2 kpi3 kpi4"
    "chart-bar chart-bar chart-bar chart-radar"
    "inventory inventory inventory inventory";
  gap: 1.5rem;
}

.kpi-card { background: #1a1a1a; border-left: 4px solid #cc0000; padding: 1.5rem; }

Lógica de Exportación Multiformato

La exportación requiere librerías externas. Asegúrese de instalar xlsx y jspdf. El método de exportación debe ser capaz de transformar el array de objetos en los formatos requeridos.

import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

exportarInventario(formato: 'excel' | 'pdf') {
  const data = this.suministros;

  if (formato === 'excel') {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Suministros');
    XLSX.writeFile(workbook, 'Reporte_ANBU.xlsx');
  } else {
    const doc = new jsPDF();
    doc.text('MANIFIESTO DE SUMINISTROS ANBU', 14, 20);
    autoTable(doc, {
      startY: 30,
      head: [['ID', 'Nombre', 'Categoría', 'Stock', 'Precio']],
      body: data.map(s => [s.id, s.nombre, s.categoria, s.stock, `${s.precioUnitario}¥`]),
    });
    doc.save('Manifiesto_Mision.pdf');
  }
}

Refinamiento Estético ANBU

Aplique una paleta de colores oscura (#0a0a0a, #1f1f1f) con acentos en rojo carmesí. Las filas con stock inferior a 10 deben mostrar una alerta visual inmediata.

<tr *ngFor="let s of suministros" [class.stock-critico]="s.stock < 10">
  <td>{{ s.nombre }}</td>
  <td>
    <span class="badge" [ngClass]="'badge-' + s.rangoRequerido.toLowerCase()">
      {{ s.rangoRequerido }}
    </span>
  </td>
</tr>

Criterios de Evaluación
Criterio	Peso	Descripción
Robustez de la Tabla	30%	Funcionamiento perfecto de filtros, ordenación y selección.
Calidad de Visualización	25%	Gráficos estéticos, correctos y reactivos a los datos.
Fidelidad de Exportación	20%	Formatos Excel y PDF legibles y bien estructurados.
Arquitectura de Angular	15%	Uso correcto de Standalone Components, Servicios e Inyección básica.
Diseño y Estética	10%	Interfaz coherente con la temática ANBU/Ninja.
Consejo de Ninja

Para que la tabla sea realmente “Avanzada”, intenta implementar un Filtro de Rango para el stock o el precio, permitiendo a los comandantes ANBU localizar suministros en rangos de presupuesto específicos. 