import { Component, OnInit, } from '@angular/core';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { IonContent, IonHeader } from '@ionic/angular/standalone';
import { NgClass } from '@angular/common';

type Rank = 'ALL' | 'S' | 'A' | 'B' | 'C' | 'D';
type Status = 'AVAIABLE' | 'IN_PROGRESS' | 'COMPLETED';
interface Mission {

  rank: Rank;
  title: string;
  description: string;
  award: number;
  username?: string;
  avatar?: string; // url

}

@Component({
  selector: 'app-missions-list',
  imports: [HeaderComponent, IonHeader, IonContent, NgClass],
  templateUrl: './missions-list.component.html',
  styleUrls: ['./missions-list.component.scss'],
})
export class MissionsListComponent  implements OnInit {

  missions: Mission[] = []
  ranks: Rank[] = ['ALL', 'S', 'A', 'B', 'C', 'D'];
  currentRank: Rank = 'ALL';

  status: Status[] = ['AVAIABLE', 'IN_PROGRESS', 'COMPLETED'];
  currentStatus: Status = 'AVAIABLE';

  constructor() { }

  ngOnInit() {}

  setRank(rank: Rank) {

    this.currentRank = rank;

  }



}
