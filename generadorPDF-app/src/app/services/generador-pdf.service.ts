import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import { Mision } from '../types/misionTypes';
import { LOGO_BASE64 } from '../assets/logoBase64';
import { SELLO_BASE64 } from '../assets/selloBase64';

@Injectable({ providedIn: 'root' })
export class PdfGeneratorService {

  // Maquetación del pdf
  private readonly PAGE_W = 210;
  private readonly PAGE_H = 297;
  private readonly MARGIN = 15;

  // Genera un pdf con los datos de la misión 
  build(Mision: Mision): jsPDF {
    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });

    this.drawBackground(doc);
    this.drawFrame(doc);
    this.drawHeader(doc);
    this.drawLogo(doc);
    const yAfterBody = this.drawBody(doc, Mision);
    this.drawSignature(doc, Mision, yAfterBody);

    if (Mision.rank === 'S') {
      this.drawSeal(doc);
    }
    return doc;
  }

  private drawBackground(doc: jsPDF): void {
    doc.setFillColor(245, 230, 200); 
    doc.rect(0, 0, this.PAGE_W, this.PAGE_H, 'F');
  }

  private drawFrame(doc: jsPDF): void {
    doc.setDrawColor(58, 43, 26); // tinta
    doc.setLineWidth(1.2);
    doc.rect(this.MARGIN - 5, this.MARGIN - 5,
             this.PAGE_W - 2 * (this.MARGIN - 5),
             this.PAGE_H - 2 * (this.MARGIN - 5));

    doc.setLineWidth(0.3);
    doc.rect(this.MARGIN, this.MARGIN,
             this.PAGE_W - 2 * this.MARGIN,
             this.PAGE_H - 2 * this.MARGIN);
  }

  private drawHeader(doc: jsPDF): void {
    doc.setFont('times', 'bold');
    doc.setTextColor(58, 43, 26);
    doc.setFontSize(26);
    doc.text('PERGAMINO DE MISIÓN', this.PAGE_W / 2, 32, { align: 'center' });

    doc.setLineWidth(0.5);
    doc.line(this.MARGIN + 10, 38, this.PAGE_W - this.MARGIN - 10, 38);

    doc.setFont('times', 'italic');
    doc.setFontSize(11);
    doc.text('Orden Oficial de la Cofradía', this.PAGE_W / 2, 44, { align: 'center' });
  }

  private drawLogo(doc: jsPDF): void {
      doc.addImage(LOGO_BASE64, 'PNG', this.MARGIN + 2, this.MARGIN + 2, 18, 0);
  }


  private drawBody(doc: jsPDF, m: Mision): number {
    const xLabel = this.MARGIN + 5;
    const xValue = this.MARGIN + 45;
    let y = 60;

    const row = (label: string, value: string) => {
      doc.setFont('times', 'bold');
      doc.setFontSize(12);
      doc.text(label, xLabel, y);
      doc.setFont('times', 'normal');
      doc.text(value, xValue, y);
      y += 9;
    };

    row('Código:',    m.code);
    row('Rango:',     m.rank);
    row('Encargado:', m.agent);
    row('Fecha:',     m.date);

    // Línea para separar los bloques
    y += 4;
    doc.setLineWidth(0.2);
    doc.line(xLabel, y, this.PAGE_W - this.MARGIN - 5, y);
    y += 8;

    // Objetivo de la misión
    doc.setFont('times', 'bold');
    doc.text('Objetivo de la misión:', xLabel, y);
    y += 7;

    doc.setFont('times', 'normal');
    doc.setFontSize(12);
    const maxWidth = this.PAGE_W - 2 * this.MARGIN - 10;
    const lines: string[] = doc.splitTextToSize(m.objective, maxWidth);

    const lineHeight = 6;
    const bottomLimit = this.PAGE_H - this.MARGIN - 40; // dejamos un pequeño hueco para el sello

    for (const line of lines) {
      if (y > bottomLimit) {
        doc.addPage();
        this.drawBackground(doc);
        this.drawFrame(doc);
        y = this.MARGIN + 15;
      }
      doc.text(line, xLabel, y);
      y += lineHeight;
    }

    return y;
  }

  // Firma
  private drawSignature(doc: jsPDF, m: Mision, yBody: number): void {
    const y = Math.max(yBody + 20, this.PAGE_H - this.MARGIN - 30);
    doc.setLineWidth(0.3);
    doc.line(this.PAGE_W - this.MARGIN - 70, y,
             this.PAGE_W - this.MARGIN - 10, y);

    doc.setFont('times', 'italic');
    doc.setFontSize(10);
    doc.text(`Firma: ${m.agent}`,
             this.PAGE_W - this.MARGIN - 40, y + 5,
             { align: 'center' });
  }

  // Sello para rango S
  private drawSeal(doc: jsPDF): void {
    const size = 35;
    const x = this.PAGE_W - this.MARGIN - size - 2;
    const y = this.PAGE_H - this.MARGIN - size - 2;
    
    doc.addImage(SELLO_BASE64, 'PNG', x, y, size, size);

  }
}