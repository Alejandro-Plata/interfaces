import { Component, Input, ViewChild, ElementRef, AfterViewInit, OnChanges } from '@angular/core';
import { Chart } from 'chart.js';

const PALETA = ['#cc0000', '#8b0000', '#ff6666', '#660000'];

@Component({
  selector: 'app-grafico-sectores',
  templateUrl: './grafico-sectores.component.html',
  styleUrls: ['./grafico-sectores.component.scss'],
  standalone: true,
})
export class GraficoSectoresComponent implements AfterViewInit, OnChanges {
  @Input() categorias: string[] = [];
  @Input() valores: number[] = [];

  @ViewChild('canvasRef') canvasRef!: ElementRef<HTMLCanvasElement>;
  private chart?: Chart;

  ngAfterViewInit() { this.render(); }

  ngOnChanges() {
    if (!this.chart) return;
    this.chart.data.labels = this.categorias;
    this.chart.data.datasets[0].data = this.valores;
    this.chart.update();
  }

  private render() {
    this.chart = new Chart(this.canvasRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: this.categorias,
        datasets: [{
          data: this.valores,
          backgroundColor: PALETA,
          borderColor: '#0a0a0a',
          borderWidth: 2,
          hoverOffset: 6,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#e5e5e5', padding: 12, boxWidth: 12 },
          },
        }
      }
    });
  }
}
