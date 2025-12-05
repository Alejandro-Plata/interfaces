import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Pet } from '../shared/pet';

@Component({
  selector: 'app-pet-list',
  imports: [],
  templateUrl: './pet-list.html',
  styleUrl: './pet-list.css',
})
export class PetList {

  // Recibimos la lista de mascotas del componente padre
  @Input()
  petsList: Pet[] = [];

  // Avisamos de que vamos a eliminar una mascota
  @Output()
  petDeleted = new EventEmitter<Pet>();

  getPets(): Pet[] {
    return this.petsList;
  }

  onDelete(pet: Pet) {
    this.petDeleted.emit(pet);
  }


}
