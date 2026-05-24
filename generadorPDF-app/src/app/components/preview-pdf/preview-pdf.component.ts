import { Component, Input } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-pdf-preview',
  standalone: true,
  imports: [],
  templateUrl: './preview-pdf.component.html',
})
export class PdfPreviewComponent {
  @Input() url: SafeResourceUrl | null = null;
}