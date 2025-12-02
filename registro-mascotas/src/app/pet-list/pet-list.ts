import { Component, EventEmitter, Input } from '@angular/core';
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

  getPets(): Pet[] {
    return this.petsList;
  }


}
