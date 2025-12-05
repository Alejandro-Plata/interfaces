import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const unknownNameValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    // Extraemos el valor del formulario
    const value = control.value;

    // Si no hay valor o no es una string, no validamos (para evitar errores con trim())
    if (!value || typeof value !== 'string') {
        return null;
    }

    // Si es desconocido, devolvemos true
    const isUnknownName = value.trim().toLowerCase() === 'desconocido'; // En caso de que el nombre sea desconocido
    return isUnknownName ? { unknownName: true } : null;
};