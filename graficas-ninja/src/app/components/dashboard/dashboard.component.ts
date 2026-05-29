import { Component, OnInit } from '@angular/core';
import { InventarioService } from '../../services/inventario.service';
import { Suministro } from '../../models/suministro.model';
import { KpiCardComponent } from '../kpi-card/kpi-card.component';
import { GraficoBarrasComponent } from '../grafico-barras/grafico-barras.component';
import { GraficoRadarComponent } from '../grafico-radar/grafico-radar.component';
import { GraficoSectoresComponent } from '../grafico-sectores/grafico-sectores.component';
import { TablaInventarioComponent } from '../tabla-inventario/tabla-inventario.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    KpiCardComponent,
    GraficoBarrasComponent,
    GraficoRadarComponent,
    GraficoSectoresComponent,
    TablaInventarioComponent,
  ],
})
export class DashboardComponent implements OnInit {
  suministros: Suministro[] = [];
  stats = { totalStock: 0, totalValor: 0, bajoStock: 0, categoriaPrincipal: '' };

  grafCategorias: string[] = [];
  grafValores: number[] = [];
  grafStock: number[] = [];

  constructor(private inventario: InventarioService) {}

  ngOnInit() { this.refrescar(); }

  refrescar() {
    this.suministros = [...this.inventario.getSuministros()];
    this.stats = this.inventario.getStats();
    const porCategoria = this.inventario.getStockPorCategoria();
    this.grafCategorias = porCategoria.map(c => c.categoria);
    this.grafValores = porCategoria.map(c => c.valor);
    this.grafStock = porCategoria.map(c => c.stock);
  }
}
