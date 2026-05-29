import { Component, Input, ViewChild, ElementRef, AfterViewInit, OnChanges } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-grafico-barras',
  templateUrl: './grafico-barras.component.html',
  styleUrls: ['./grafico-barras.component.scss'],
  standalone: true,
})
export class GraficoBarrasComponent implements AfterViewInit, OnChanges {
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
      type: 'bar',
      data: {
        labels: this.categorias,
        datasets: [{
          label: 'Valor de Inventario (¥)',
          data: this.valores,
          backgroundColor: 'rgba(204, 0, 0, 0.7)',
          borderColor: '#cc0000',
          borderWidth: 1,
          borderRadius: 4,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#e5e5e5' } },
        },
        scales: {
          x: { ticks: { color: '#e5e5e5' }, grid: { color: 'rgba(255,255,255,0.08)' } },
          y: { ticks: { color: '#e5e5e5' }, grid: { color: 'rgba(255,255,255,0.08)' } },
        }
      }
    });
  }
}
