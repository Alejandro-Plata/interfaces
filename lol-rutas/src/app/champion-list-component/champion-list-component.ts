import { Component, inject } from '@angular/core';
import { ChampionSelect } from '../interfaces/champion-select';
import { ChampionRequestService } from '../services/champion-request-service';
import { FormsModule } from '@angular/forms';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-champion-list-component',
  imports: [FormsModule, RouterLink],
  templateUrl: './champion-list-component.html',
  styleUrl: './champion-list-component.css',
})
export class ChampionListComponent {

  private championService = inject(ChampionRequestService);

  isLoading: boolean = true;
  champions: ChampionSelect[] = [];
  searchQuery: string = '';

  ngOnInit(): void {
    this.loadChampions();
  }

  private async loadChampions(): Promise<void> {
    const champions: ChampionSelect[] = await this.championService.getChampions(); // Obtiene todos los campeones

    this.champions = champions; // Asigna los campeones al array de campeones
    this.isLoading = false;  // Desactiva el loader
  }

  filteredChampions() {
    return this.champions.filter(champion => champion.nombre.trim().toLowerCase().includes(this.searchQuery.trim().toLowerCase())); // Filtra los campeones normalizando primero el value del input
  }

}
