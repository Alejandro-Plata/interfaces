import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/authService/auth-service';
import { NinjaProfile } from 'src/app/types/types';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, RouterLink, IonContent, IonIcon],
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {

    private authService: AuthService;
    profile: NinjaProfile | null = null;
    xpPercentage: number = 0;
    xpToNextRank: number = 1000;

    constructor(authService: AuthService) {
        this.authService = authService;
    }

    ngOnInit() {
        this.authService.getProfile().subscribe((profile: NinjaProfile) => {
            this.profile = profile;
            this.calculateXPPercentage();
        });
    }

    logout() {
        this.authService.logout();
    }

    calculateXPPercentage() {
        if (this.profile?.profile?.experience) {
            this.xpPercentage = this.profile.profile.experience / this.xpToNextRank * 100;
        }
    }


}
