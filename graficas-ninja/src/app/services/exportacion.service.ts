import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Suministro } from '../models/suministro.model';

@Injectable({ providedIn: 'root' })
export class ExportacionService {
  exportarInventario(formato: 'excel' | 'pdf', data: Suministro[]) {
    if (formato === 'excel') {
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Suministros');
      XLSX.writeFile(workbook, 'Reporte_ANBU.xlsx');
    } else {
      const doc = new jsPDF();
      doc.setTextColor(30, 30, 30);
      doc.setFontSize(14);
      doc.text('MANIFIESTO DE SUMINISTROS ANBU', 14, 20);
      autoTable(doc, {
        startY: 30,
        head: [['ID', 'Nombre', 'Categoría', 'Stock', 'Precio']],
        body: data.map(s => [s.id, s.nombre, s.categoria, s.stock, `${s.precioUnitario}¥`]),
        styles: { fillColor: [245, 245, 245], textColor: [30, 30, 30] },
        headStyles: { fillColor: [204, 0, 0], textColor: [255, 255, 255], fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [225, 225, 225] },
      });
      doc.save('Manifiesto_Mision.pdf');
    }
  }
}
