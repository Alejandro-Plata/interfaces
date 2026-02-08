import { Component, OnInit, signal, } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonSplitPane, IonIcon, IonMenu, IonMenuButton } from '@ionic/angular/standalone';
import { MissionCardComponent } from "./mission-card/mission-card.component";
import { MissionData, Ninja, Rank } from 'src/app/types/types';
import { MissionService } from 'src/app/services/missions/mission-service';
import { AuthService } from 'src/app/services/authService/auth-service';
import { FormsModule } from '@angular/forms';
import { getUser } from 'src/app/utils/getPreferences';

@Component({
  selector: 'app-missions-list',
  imports: [RouterLink, IonSplitPane, IonIcon, MissionCardComponent, IonMenu, FormsModule, IonMenuButton],
  templateUrl: './missions-list.component.html',
  styleUrls: ['./missions-list.component.scss'],
})
export class MissionsListComponent implements OnInit {

  private missionService: MissionService;
  private authService: AuthService;
  ninja: Ninja | null = null;
  currentUser: Ninja | null = null;
  missions: MissionData[] = [];
  ranks: Rank[] = ['ALL', 'D', 'C', 'B', 'A', 'S'];
  statuses: string[] = ['TODAS', 'DISPONIBLE', 'EN_CURSO', 'COMPLETADA'];

  constructor(missionService: MissionService, authService: AuthService) {
    this.missionService = missionService;
    this.authService = authService;

    getUser().then((user) => {
      this.ninja = user;
      this.currentUser = user;
    });

  }

  ngOnInit() {
    this.loadMissions();
  }

  ionViewWillEnter() {
    // Reload missions when entering the view (e.g., after navigating back from detail)
    this.loadMissions();
  }

  loadMissions() {
    this.missionService.getMissions('ALL').subscribe((missionsData) => {
      this.missions = missionsData.data;
    });
  }

  selectedRank: Rank = 'ALL';
  selectedStatus: string = 'TODAS';
  searchText: string = '';

  toggleRank(rank: Rank) {
    this.selectedRank = rank;
  }

  toggleStatus(status: string) {
    this.selectedStatus = status;
  }

  filteredMissions() {
    return this.missions.filter((mission) => {

      const matchesRank = this.selectedRank === 'ALL' || mission.rankRequirement === this.selectedRank;
      const matchesStatus = this.selectedStatus === 'TODAS' || mission.status === this.selectedStatus;
      const searchLower = this.searchText.toLowerCase().trim();
      const matchesSearch = !searchLower || mission.title.toLowerCase().includes(searchLower);

      return matchesRank && matchesStatus && matchesSearch;
    });
  }

  logout() {
    this.authService.logout();
  }

}
