import { Component, OnInit } from '@angular/core';
import { MatchCardComponent } from 'src/app/components/match-card/match-card.component';
import { Match, Status } from 'src/app/types/types';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from "src/app/components/header/header.component";
import { SidebarComponent } from "src/app/components/sidebar/sidebar.component";

@Component({
  selector: 'app-panel',
  imports: [MatchCardComponent, FormsModule, HeaderComponent, SidebarComponent],
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss'],
})
export class PanelComponent  implements OnInit {

  matches: Match[] = []; // Lista cruda de partidos
  searchQuery = '';
  filterStatus: Status | 'Todos' = 'Todos';
  currentMatchday = 1;

  async ngOnInit() {
    // Aquí llamarías a tu servicio con fetch
    // this.matches.set(await this.matchesService.getAll());
    
    // MOCK DATA para visualizar el diseño
    this.matches = [
      {
        id: '1',
        homeTeam: { id: 'rm', name: 'Real Madrid', logoUrl: 'assets/pack-escudos/real_madrid.png' },
        awayTeam: { id: 'bar', name: 'Barcelona', logoUrl: 'assets/pack-escudos/fc_barcelona.png' },
        score: { home: 2, away: 1 },
        status: 'En vivo',
        date: new Date(Date.now()).toLocaleDateString('es-ES'),
        matchday: 14,
        league: 'La Liga',
        lastScorer: 'Vinicius Jr (72\')'
      },
      {
        id: '2',
        homeTeam: { id: 'liv', name: 'Almería', logoUrl: 'assets/pack-escudos/almeria.png' },
        awayTeam: { id: 'mci', name: 'Alavés', logoUrl: 'assets/pack-escudos/alaves.png' },
        score: { home: 0, away: 0 },
        status: 'Próximos',
        date: new Date(Date.now() + 86400000).toLocaleDateString('es-ES'),
        matchday: 14,
        league: 'Premier League'
      },
      {
        id: '3',
        homeTeam: { id: 'juv', name: 'Mallorca', logoUrl: 'assets/pack-escudos/mallorca.png' },
        awayTeam: { id: 'mil', name: 'Sevilla', logoUrl: 'assets/pack-escudos/sevilla.png' },
        score: { home: 1, away: 3 },
        status: 'Finalizados',
        date: new Date(Date.now() - 86400000).toLocaleDateString('es-ES'),
        matchday: 13,
        league: 'Serie A',
        lastScorer: 'Leao (89\')'
      }
    ]
  }

   filteredMatchesBySearch(): Match[] {

    if (!this.matches) return [];

    return this.matches.filter(match => {

      const matchesStatus = this.filterStatus === 'Todos' || match.status === this.filterStatus;

      const query = this.searchQuery.toLowerCase();
      const matchesSearch = match.homeTeam.name.toLowerCase().includes(query) || match.awayTeam.name.toLowerCase().includes(query) || match.league.toLowerCase().includes(query);

      // Se tiene que cumplir que coincida con la búsqueda y con la query
      return matchesStatus && matchesSearch;
    });
  }

  setFilter(status: 'Todos' | Status) {
    this.filterStatus = status;
  }

}
