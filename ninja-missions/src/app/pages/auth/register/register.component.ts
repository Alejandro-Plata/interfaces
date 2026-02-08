import { Component, inject } from '@angular/core';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from 'src/app/services/authService/auth-service';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [IonContent, ReactiveFormsModule, RouterLink, IonIcon],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {


  private authService: AuthService;
  private router: Router;
  showPassword = false;
  errorMessage: string | null = null;

  constructor(authService: AuthService, router: Router, private fb: FormBuilder) {
    this.authService = authService;
    this.router = router;
  }

  registerForm = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }

    this.authService.register(this.registerForm.value.username!, this.registerForm.value.password!).then((error) => {
      if (!error) {
        this.authService.login(this.registerForm.value.username!, this.registerForm.value.password!).then((error) => {
          if (!error) {
            this.router.navigate(['/missions']);
          }
        }).catch((error) => {
          this.errorMessage = error.error.message;
        });
      }
    }).catch((error) => {
      this.errorMessage = error.error.message;
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

}
