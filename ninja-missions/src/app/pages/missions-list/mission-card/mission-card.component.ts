import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MissionData, Ninja } from 'src/app/types/types';
import { MissionService } from 'src/app/services/missions/mission-service';
import { FormsModule } from '@angular/forms';
import { IonIcon } from '@ionic/angular/standalone';
import { getUser } from 'src/app/utils/getPreferences';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mission-card',
  templateUrl: './mission-card.component.html',
  styleUrl: './mission-card.component.scss',
  imports: [CommonModule, FormsModule, IonIcon]
})
export class MissionCardComponent {

  @Input() mission!: MissionData;
  @Output() accept = new EventEmitter<string>();

  private missionService: MissionService;
  private router: Router;
  ninja: Ninja | null = null;

  constructor(missionService: MissionService, router: Router) {
    this.missionService = missionService;
    this.router = router;

    getUser().then((user) => {
      this.ninja = user;
    });
  }

  canAccept() {
    if (!this.ninja) return false;
    return this.missionService.canAcceptMission(this.mission.rankRequirement, this.ninja);
  }

  viewDetails() {
    this.router.navigate(['/mission-detail', this.mission.id]);
  }

}
