import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { debounceTime } from 'rxjs';
import { Mision } from '../../types/misionTypes';

@Component({
  selector: 'app-mision-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './formulario.component.html',
})
export class FormularioComponent implements OnInit {
  private fb = inject(FormBuilder);

  @Output() valueChange = new EventEmitter<Mision>();
  @Output() submitForm  = new EventEmitter<Mision>();

  form = this.fb.nonNullable.group({
    code:      ['M-0001', [Validators.pattern(/M-\d{4}/),Validators.required]],
    rank:      ['A',      [Validators.required]],
    agent:     ['',       [Validators.required, Validators.minLength(3)]],
    objective: ['',       [Validators.required, Validators.minLength(5)]],
    date:      [new Date().toISOString().slice(0, 10), [Validators.required]],
  });

  ngOnInit(): void {
    // Previsualización en tiempo real 
    this.form.valueChanges
      .pipe(debounceTime(200)) // El debounce es para que no se genere un nuevo pdf todo el rato, le da un pequeño delay
      .subscribe(() => {
        if (this.form.valid) {
          this.valueChange.emit(this.form.getRawValue() as Mision);
        }
      });

    // Si el formulario es válido, comienza a verse una preview
    queueMicrotask(() => {
      if (this.form.valid) {
        this.valueChange.emit(this.form.getRawValue() as Mision);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitForm.emit(this.form.getRawValue() as Mision);
  }
}