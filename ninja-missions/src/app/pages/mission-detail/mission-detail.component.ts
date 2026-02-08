import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IonContent, IonIcon, ToastController } from '@ionic/angular/standalone';
import { MissionService } from 'src/app/services/missions/mission-service';
import { Camera, CameraResultType } from '@capacitor/camera';
import { MissionData, MissionReport, Rank } from 'src/app/types/types';
import { getUser } from 'src/app/utils/getPreferences';

@Component({
  selector: 'app-mission-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, IonContent, IonIcon],
  templateUrl: './mission-detail.component.html',
  styleUrls: ['./mission-detail.component.scss'],
})
export class MissionDetailComponent {

  private missionService: MissionService;
  private route: ActivatedRoute;
  private router: Router;
  private toastController: ToastController;

  uploadedImage: string | null = null;
  isAccepted = false;
  missionReport: MissionReport | null = null;
  reportText: string = '';
  ninjaUsername: string | null = null;
  mission: MissionData | null = null;
  missionId: string | null = null;

  constructor(missionService: MissionService, route: ActivatedRoute, router: Router, toastController: ToastController) {
    this.missionService = missionService;
    this.route = route;
    this.router = router;
    this.toastController = toastController;
  }

  ngOnInit() {
    this.loadMissionData();
  }

  loadMissionData() {
    this.missionId = this.route.snapshot.paramMap.get('id');

    getUser().then((user) => {
      this.ninjaUsername = user.username;

      if (this.missionId) {
        this.obtainMission();
      }
    });
  }

  obtainMission() {
    this.missionService.getMissions('ALL').subscribe((missionsData) => {
      this.mission = missionsData.data.find((m: MissionData) => m.id === this.missionId) || null;

      if (this.mission) {
        this.isAccepted = this.mission.acceptedByNinjaName === this.ninjaUsername;
      }
    });
  }

  canAcceptMission(): boolean {
    if (!this.mission || !this.ninjaUsername) return false;

    if (this.mission.status === 'COMPLETADA') return false;

    return true;
  }

  isMissionInProgress(): boolean {
    return this.mission?.status === 'EN_CURSO' && this.isAccepted;
  }

  isMissionCompleted(): boolean {
    return this.mission?.status === 'COMPLETADA';
  }

  takePicture = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri
    });
    const imageUrl = image.webPath;

    if (imageUrl) {
      this.uploadedImage = imageUrl;
      const imageElement = document.getElementById('image') as HTMLImageElement;
      if (imageElement) {
        imageElement.src = imageUrl;
      }
    }
  };

  removeImage() {
    this.uploadedImage = null;
  }

  acceptMission() {
    if (!this.canAcceptMission()) return;

    this.missionService.acceptMission(this.mission!.id).subscribe({
      next: async () => {
        this.isAccepted = true;

        const toast = await this.toastController.create({
          message: '¡Misión aceptada! Mucha suerte, ninja.',
          duration: 2000,
          position: 'top',
          color: 'success'
        });
        await toast.present();

        this.obtainMission();
      },
      error: async (error) => {
        const toast = await this.toastController.create({
          message: 'Error al aceptar la misión.',
          duration: 2000,
          position: 'top',
          color: 'danger'
        });
        await toast.present();
      }
    });
  }

  abandonMission() {
    this.missionService.abandonMission(this.mission!.id).subscribe({
      next: async () => {
        this.isAccepted = false;

        const toast = await this.toastController.create({
          message: 'Misión abandonada.',
          duration: 2000,
          position: 'top',
          color: 'warning'
        });
        await toast.present();

        this.router.navigate(['/missions']);
      },
      error: async (error) => {
        const toast = await this.toastController.create({
          message: 'Error al abandonar la misión.',
          duration: 2000,
          position: 'top',
          color: 'danger'
        });
        await toast.present();
      }
    });
  }

  getRankClass(rank: Rank) {
    return rank.toLowerCase();
  }

  async submitReport() {
    if (!this.reportText.trim()) {
      const toast = await this.toastController.create({
        message: 'Debes escribir un reporte antes de enviar.',
        duration: 2000,
        position: 'top',
        color: 'warning'
      });
      await toast.present();
      return;
    }

    this.missionReport = {
      evidenceImageUrl: this.uploadedImage || '',
      reportText: this.reportText
    };

    this.missionService.updateMissionReport(this.mission!.id, this.missionReport).subscribe({
      next: async () => {
        const toast = await this.toastController.create({
          message: '¡Reporte enviado! Misión completada con éxito.',
          duration: 2000,
          position: 'top',
          color: 'success'
        });
        await toast.present();

        setTimeout(() => {
          this.router.navigate(['/missions']);
        }, 1500);
      },
      error: async (error) => {
        const toast = await this.toastController.create({
          message: 'Error al enviar el reporte.',
          duration: 2000,
          position: 'top',
          color: 'danger'
        });
        await toast.present();
      }
    });
  }

}
