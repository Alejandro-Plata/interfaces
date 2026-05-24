import { Component, inject, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormularioComponent } from './components/formulario/formulario.component';
import { PdfPreviewComponent } from './components/preview-pdf/preview-pdf.component';
import { PdfGeneratorService } from './services/generador-pdf.service';
import { Mision } from './types/misionTypes';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormularioComponent, PdfPreviewComponent],
  templateUrl: './app.html',
})
export class App implements OnDestroy {
  private pdfService = inject(PdfGeneratorService);
  private sanitizer  = inject(DomSanitizer);

  previewUrl: SafeResourceUrl | null = null;
  generating = false;

  private urlPdf: string | null = null;

  onMissionChange(mision: Mision): void {
    const doc  = this.pdfService.build(mision);
    const pdf = doc.output('blob');

    if (this.urlPdf) {
      URL.revokeObjectURL(this.urlPdf);
    }

    this.urlPdf = URL.createObjectURL(pdf);
    // Angular bloquea urls desconocidas en el src, esto le indica que esta url es segura
    this.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.urlPdf);
  }

  onMissionSubmit(mision: Mision): void {
    this.generating = true;
    try {
      const doc = this.pdfService.build(mision);
      doc.save(`mision-${mision.code}.pdf`);
    } finally {
      setTimeout(() => (this.generating = false), 600);
    }
  }

  ngOnDestroy(): void {
    if (this.urlPdf) {
      URL.revokeObjectURL(this.urlPdf);
    }
  }
}
