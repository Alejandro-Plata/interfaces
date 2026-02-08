import { Component, OnInit } from '@angular/core';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from 'src/app/services/authService/auth-service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  standalone: true,
  imports: [IonContent, RouterLink, ReactiveFormsModule, IonIcon],
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  showPassword = false;
  private authService: AuthService;
  private router: Router;
  errorMessage: string | null = null;

  constructor(authService: AuthService, router: Router, private fb: FormBuilder) {
    this.authService = authService;
    this.router = router;
  }

  ngOnInit() { }

  loginForm = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    this.authService.login(this.loginForm.value.username!, this.loginForm.value.password!).then((error) => {

      if (!error) {
        this.router.navigate(['/missions']);
      }

    }).catch((error) => {
      this.errorMessage = error.error.message;
    });
  }

}
