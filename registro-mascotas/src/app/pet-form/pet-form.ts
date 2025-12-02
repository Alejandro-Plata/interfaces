import { inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Component, EventEmitter, Output } from '@angular/core';
import { Pet } from '../shared/pet';

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
    name: ['', [Validators.required, Validators.minLength(2)]],
    type: ['', Validators.required],
    age: ['', [Validators.required, Validators.min(0)]],
    hasChip: [false],
  });

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

      const values = this.petForm.getRawValue();

      this.petCreated.emit({
        name: values.name,
        type: values.type,
        age: +values.age,
        hasChip: values.hasChip,
        id: 0 // Placeholder
      });

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

    return '';
  }

}
