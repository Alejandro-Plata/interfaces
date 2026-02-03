import { Component, OnInit } from '@angular/core';
import { AcceptedMissionComponent } from './components/accepted-mission/accepted-mission.component';
import { NonAcceptedMissionComponent } from './components/non-accepted-mission/non-accepted-mission.component';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-mission-detail',
  imports: [AcceptedMissionComponent, NonAcceptedMissionComponent, IonContent],
  templateUrl: './mission-detail.component.html',
  styleUrls: ['./mission-detail.component.scss'],
})
export class MissionDetailComponent  implements OnInit {

  accepted = true;

  constructor() { }

  ngOnInit() {}

}
