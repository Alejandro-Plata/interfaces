import { Component, Input, ViewChild, ElementRef, AfterViewInit, OnChanges } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-grafico-radar',
  templateUrl: './grafico-radar.component.html',
  styleUrls: ['./grafico-radar.component.scss'],
  standalone: true,
})
export class GraficoRadarComponent implements AfterViewInit, OnChanges {
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
      type: 'radar',
      data: {
        labels: this.categorias,
        datasets: [{
          label: 'Stock',
          data: this.valores,
          backgroundColor: 'rgba(204, 0, 0, 0.25)',
          borderColor: '#cc0000',
          borderWidth: 2,
          pointBackgroundColor: '#cc0000',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#cc0000',
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#e5e5e5' } },
        },
        scales: {
          r: {
            ticks: { display: false },
            grid: { color: 'rgba(255,255,255,0.1)' },
            pointLabels: { color: '#e5e5e5', font: { size: 11 } },
            angleLines: { color: 'rgba(255,255,255,0.15)' },
          }
        }
      }
    });
  }
}
