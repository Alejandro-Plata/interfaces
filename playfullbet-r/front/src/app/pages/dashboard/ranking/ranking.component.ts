import { Component, OnInit, signal } from '@angular/core';
import { SidebarComponent } from "src/app/components/sidebar/sidebar.component";
import { HeaderComponent } from "src/app/components/header/header.component";
import { UserRank } from 'src/app/types/types';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss'],
  imports: [SidebarComponent, HeaderComponent],
})
export class RankingComponent  implements OnInit {

  top3 = signal<UserRank[]>([]);
  restOfPlayers = signal<UserRank[]>([]);
  isLoading = signal(true);

  async ngOnInit() {
    try {
      // 1. Obtener datos reales (o Mock si falla)
      let data: UserRank[] = this.getMockData();
     

      // 2. Procesar datos (Asignar posición real)
      const rankedData = data.map((user, index) => ({
        ...user,
        position: index + 1
      }));

      // 3. Separar el Podio del resto
      this.top3.set(rankedData.slice(0, 3));
      this.restOfPlayers.set(rankedData.slice(3));

    } finally {
      this.isLoading.set(false);
    }
  }

  getMockData(): UserRank[] {
    return [
      { id: 1, username: 'CryptoKing', points: 15400, avatar: 'assets/avatars/1.png' },
      { id: 2, username: 'MollyFan', points: 12350, avatar: 'assets/avatars/2.png' },
      { id: 3, username: 'ElBicho7', points: 9800, avatar: 'assets/avatars/3.png' },
      { id: 4, username: 'ApuestaSegura', points: 8500, avatar: 'assets/avatars/4.png' },
      { id: 5, username: 'Benzema15', points: 7200, avatar: 'assets/avatars/5.png' },
      { id: 6, username: 'Novato_22', points: 4100, avatar: 'assets/avatars/6.png' },
      { id: 7, username: 'User_X', points: 200, avatar: 'assets/avatars/7.png' },
    ];
  }

}
