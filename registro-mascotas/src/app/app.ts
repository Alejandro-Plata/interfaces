import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PetForm } from "./pet-form/pet-form";
import { PetList } from "./pet-list/pet-list";
import { Pet } from './shared/pet';

@Component({
  selector: 'app-root',
  imports: [PetForm, PetList],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  // Creamos una lista con las mascotas de mascotas
  pets: Pet[] = [];

  // Emitimos el evento
  @Output()
  petToTheList = new EventEmitter<Pet>();

  // Recibimos el evento de mascota registrada
  whenPetRegistered(pet: Pet) {
    this.pets.push(pet);
    this.petToTheList.emit(pet);
  }

  whenPetDeleted(petToDelete: Pet) {
    // Filtra las mascotas y elimina la que hemos emitido desde el pet-list
    this.pets = this.pets.filter(pet => pet !== petToDelete);
  }

}
