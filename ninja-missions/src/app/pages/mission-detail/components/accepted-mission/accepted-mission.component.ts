import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader } from '@ionic/angular/standalone';

@Component({
  selector: 'app-accepted-mission',
  imports: [FormsModule, IonContent, IonHeader],
  templateUrl: './accepted-mission.component.html',
  styleUrls: ['./accepted-mission.component.scss'],
})
export class AcceptedMissionComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

  reportText: string = '';
  uploadedFile: string | null = 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=200';

  handleFiles(event: any) {
    // Simulación simple de carga
    if (event.target.files && event.target.files[0]) {
    }
  }

  removeFile() {
    this.uploadedFile = null;
  }

  submitReport() {
    console.log('Reporte enviado:', this.reportText);
  }

  abandonMission() {
    console.log('Misión abortada');
  }
}
