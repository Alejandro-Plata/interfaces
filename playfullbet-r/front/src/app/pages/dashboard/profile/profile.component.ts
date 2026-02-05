import { Component, OnInit, signal } from '@angular/core';
import { UserProfile } from 'src/app/types/types';
import { SidebarComponent } from "src/app/components/sidebar/sidebar.component";
import { HeaderComponent } from "src/app/components/header/header.component";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  imports: [SidebarComponent, HeaderComponent],
})
export class ProfileComponent  implements OnInit {

  // Signal para el usuario
  user = signal<UserProfile | null>(null);
  

  ngOnInit() {
    // Mock Data (Aquí llamarías a tu AuthService.getUser())
    this.user.set({
      id: 1,
      username: 'Alejandro',
      email: 'alex.vip@mollys.com',
      avatarUrl: 'assets/default-avatar.png', // Asegúrate de tener esta imagen o usa una URL externa
      points: 12500,
      winRate: 68.5,
      rank: "Top 3",
    });
    
  }

}
