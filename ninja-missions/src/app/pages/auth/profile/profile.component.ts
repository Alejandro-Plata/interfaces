import { Component } from '@angular/core';
import { IonContent, IonHeader } from '@ionic/angular/standalone';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  imports: [IonContent, IonHeader],
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {

  constructor() { }

  
  ninja = {
    name: "",
    avatar: "",
    rank: "",
    age: "",
    village: "",
    xp: 3,
    nextLevelXp: 10,
    level: 3,
  }

  getXpPercentage() {

  }

}
