import { Component, OnInit } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
@Component({
  standalone: true,
  imports:[IonContent],
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent  implements OnInit {

  showPassword = false;

  constructor() { }

  ngOnInit() {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onLogin() {
    console.log('Iniciando misión...');
    // Aquí iría tu lógica de autenticación
  }

}
