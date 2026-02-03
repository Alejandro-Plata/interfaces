import { Component, OnInit } from '@angular/core';
import { IonContent, IonHeader } from '@ionic/angular/standalone';

@Component({
  selector: 'app-non-accepted-mission',
  imports: [IonContent, IonHeader],
  templateUrl: './non-accepted-mission.component.html',
  styleUrls: ['./non-accepted-mission.component.scss'],
})
export class NonAcceptedMissionComponent  implements OnInit {

  userRank: string = 'Genin'; 
  hasAccess: boolean = false;
  
  // Temporizador
  timeLeft: string = '04:12:59:02';
  private timerInterval: any;

  constructor() {}

  ngOnInit() {
    this.hasAccess = this.userRank === 'Jounin' || this.userRank === 'Anbu';
    this.startCountdown();
  }

  ngOnDestroy() {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }

  startCountdown() {
    // Aquí podrías implementar una lógica real de cuenta regresiva
    this.timerInterval = setInterval(() => {
      // Lógica de decremento de tiempo
    }, 1000);
  }

}
