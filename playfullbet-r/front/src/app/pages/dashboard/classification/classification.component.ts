import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { MatchesService } from 'src/app/services/matches-service';
import { Match, TeamStats } from 'src/app/types/types';
import { SidebarComponent } from "src/app/components/sidebar/sidebar.component";
import { HeaderComponent } from "src/app/components/header/header.component";

@Component({
  selector: 'app-classification',
  templateUrl: './classification.component.html',
  styleUrls: ['./classification.component.scss'],
  imports: [SidebarComponent, HeaderComponent],
})
export class ClassificationComponent  implements OnInit {

  private standingsService = inject(MatchesService);

  // Signals
  tableData = signal<TeamStats[]>([]);
  matchResults = signal<Match[]>([]);
  
  // Control de Jornada
  currentMatchday = signal(14); // Empezamos en la actual
  maxMatchday = 38;

  constructor() {
    // Efecto: Cuando cambie currentMatchday, carga los partidos automáticamente
    effect(() => {
      this.loadMatches(this.currentMatchday());
    });
  }

  async ngOnInit() {
    this.tableData.set(await this.standingsService.getStandings());
  }

  async loadMatches(day: number) {
    // Aquí podrías poner un loading = true
    const matches = await this.standingsService.getMatchesByMatchday(day);
    this.matchResults.set(matches);
  }

  // Navegación
  prevDay() {
    if (this.currentMatchday() > 1) {
      this.currentMatchday.update(d => d - 1);
    }
  }

  nextDay() {
    if (this.currentMatchday() < this.maxMatchday) {
      this.currentMatchday.update(d => d + 1);
    }
  }

}
