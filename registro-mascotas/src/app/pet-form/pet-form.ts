import { inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Component, EventEmitter, Output } from '@angular/core';
import { Pet } from '../shared/pet';
import { unknownNameValidator } from '../validaciones/unknownNameValidator'

@Component({
  selector: 'app-pet-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './pet-form.html',
  styleUrl: './pet-form.css',
})
export class PetForm {

  // Creamos el output (Pet es una interfaz definida en la carpeta shared)
  @Output()
  petCreated = new EventEmitter<Pet>();

  // Inyectamos el FormBuilder
  private fb = inject(FormBuilder);

  // Definimos las validaciones del formulario
  petForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2), unknownNameValidator]], // Validación personalizada para que el nombre no sea desconocido
    type: ['', Validators.required],
    age: ['', [Validators.required, Validators.min(0)]],
    hasChip: [false],
  });

  // Variable para controlar el toast
  showSuccessToast = false;

  // Getters y setters

  get name(): AbstractControl | null {
    return this.petForm.get('name');
  }

  get type(): AbstractControl | null {
    return this.petForm.get('type');
  }

  get age(): AbstractControl | null {
    return this.petForm.get('age');
  }

  get hasChip(): AbstractControl | null {
    return this.petForm.get('hasChip');
  }


  // Si el formulario es válido, emitimos el evento con los valores de la mascota
  onSubmit() {
    if (this.petForm.valid) {

      const values = this.petForm.getRawValue(); // Extraemos los valores para poder pasar la edad a number

      this.petCreated.emit({
        name: values.name,
        type: values.type,
        age: +values.age, // Con el operador unitario convertimos la edad a number
        hasChip: values.hasChip,
      });

      // Mostramos el toast cuando el formulario es válido
      this.triggerToast();

      this.petForm.reset(); // Reseteamos el formulario al finalizar
    }
  }

  getErrorMessage(controlName: string): string {
    const control = this.petForm.get(controlName);

    if (control?.hasError('required')) return 'Este campo es obligatorio';

    if (control?.hasError('min')) return 'No se permiten edades negativas';

    if (control?.hasError('minlength')) {
      const requiredLength = control.errors?.['minlength'].requiredLength;
      return `Mínimo ${requiredLength} caracteres`;
    }

    if (control?.hasError('unknownName')) return 'El nombre no puede ser "desconocido"';

    return '';
  }

  // Muestra el toast y lo oculta después de 3 segundos
  triggerToast() {
    this.showSuccessToast = true;

    setTimeout(() => {
      this.showSuccessToast = false;
    }, 3000);
  }

}
