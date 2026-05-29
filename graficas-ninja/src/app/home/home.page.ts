import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { DashboardComponent } from '../components/dashboard/dashboard.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, DashboardComponent],
})
export class HomePage {}
