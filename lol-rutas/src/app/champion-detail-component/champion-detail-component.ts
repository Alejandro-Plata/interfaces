import { Component, inject, signal, OnInit } from '@angular/core';
import type { ChampionDetail } from '../interfaces/champion-detail';
import { ChampionRequestService } from '../services/champion-request-service';
import { ActivatedRoute } from '@angular/router'; // Permite obtener el parámetro de la ruta
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-champion-detail-component',
  imports: [RouterLink],
  templateUrl: './champion-detail-component.html',
  styleUrl: './champion-detail-component.css',
})
export class ChampionDetailComponent implements OnInit {

  private championService = inject(ChampionRequestService);
  private route = inject(ActivatedRoute);

  champion: ChampionDetail | null = null;
  isLoading: boolean = true;

  ngOnInit(): void {
    this.loadChampionDetail();
  }

  private async loadChampionDetail(): Promise<void> {
    const championId = this.route.snapshot.paramMap.get('id');
    if (championId) {
      const champion: ChampionDetail = await this.championService.getChampionDetail(championId);

      this.champion = champion;
      this.isLoading = false;
    }
  }

}
