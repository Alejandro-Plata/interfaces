import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrls: ['./contact.css'],
})
export class Contact {

  contactForm: any;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      subject: ['', Validators.required],
      message: ['', Validators.required],
    });
  }

  async sendMail() {
    if (this.contactForm.invalid) return;

    const data = {
      to: 'correo@gmail.com',
      name: this.contactForm.value.name,
      subject: this.contactForm.value.subject,
      message: this.contactForm.value.message,
    };

    await fetch('https://formspree.io/f/your-endpoint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    alert('Mensaje enviado correctamente.');
    this.contactForm.reset();
  }
}
