import { Injectable } from '@angular/core';
import { ChampionDetail } from '../interfaces/champion-detail';
import { ChampionSelect } from '../interfaces/champion-select';

@Injectable({
  providedIn: 'root',
})
export class ChampionRequestService {

  private version = "15.8.1";
  private baseUrl = `https://ddragon.leagueoflegends.com/cdn/${this.version}/data/es_ES`;
  private imagenMiniaturaUrl = `https://ddragon.leagueoflegends.com/cdn/${this.version}/img/champion/`
  private splashUrl = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash`;

  async getChampions(): Promise<ChampionSelect[]> {

    const champions: ChampionSelect[] = [];

    const response = await fetch(`${this.baseUrl}/champion.json`);
    const data = await response.json();
    const championsData = data.data;

    // Recorremos todos los campeones
    for (const championId in championsData) {
      const champion = championsData[championId]; // Obtenemos todo el objeto del campeon
      champions.push({ // Nos quedamos solo con las propiedades que nos interesan
        nombre: champion.name,
        id: champion.id,
        imagen: this.imagenMiniaturaUrl + champion.image.full,
      });
    }

    return champions;
  }

  // Este id lo obtenemos de la url de la ruta
  async getChampionDetail(id: string): Promise<ChampionDetail> {

    const response = await fetch(`${this.baseUrl}/champion/${id}.json`);
    const data = await response.json();
    const championData = data.data[id];

    return {
      nombre: championData.name,
      id: championData.id,
      title: championData.title,
      lore: championData.lore,
      tags: championData.tags,
      splash: this.getSplashUrl(championData.id),
      imagen: this.imagenMiniaturaUrl + championData.image.full,
    };
  }

  // Devuelve la url de la splash art
  getSplashUrl(championId: string): string {
    return `${this.splashUrl}/${championId}_0.jpg`;
  }

}
