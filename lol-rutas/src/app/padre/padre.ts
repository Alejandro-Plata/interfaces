import { Component, Output } from '@angular/core';
import { Hijo } from '../hijo/hijo';

export interface User {
  nombre: string,
  apellidos: string
}

@Component({
  selector: 'app-padre',
  imports: [Hijo],
  templateUrl: './padre.html',
  styleUrl: './padre.css',
})
export class Padre {

  @Output()
  userHijo!: User; 

}
