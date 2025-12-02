import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { Pet } from '../shared/pet';

@Component({
  selector: 'app-pet-list',
  imports: [],
  templateUrl: './pet-list.html',
  styleUrl: './pet-list.css',
})
export class PetList implements OnInit {

  // Creamos una lista con las mascotas de mascotas
  pets: Pet[] = [];

  // Recibimos el evento
  @Input()
  petCreated = new EventEmitter<Pet>();

  // Añadimos la mascota a la lista
  ngOnInit(): void {
    this.petCreated.subscribe(pet => {
      // Añadimos un id a la mascota
      pet.id = this.pets.length + 1;
      this.pets.push(pet);
    });
  }

  getPets(): Pet[] {
    return this.pets;
  }

}
