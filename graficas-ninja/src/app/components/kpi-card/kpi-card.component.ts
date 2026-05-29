import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-kpi-card',
  templateUrl: './kpi-card.component.html',
  styleUrls: ['./kpi-card.component.scss'],
  standalone: true,
  imports: [],
})
export class KpiCardComponent {
  @Input() titulo = '';
  @Input() valor: string | number = '';
  @Input() sufijo = '';
  @Input() critico = false;
}
