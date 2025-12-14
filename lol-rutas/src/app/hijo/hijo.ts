import { Component, Input } from '@angular/core';
import { User } from '../padre/padre';

@Component({
  selector: 'app-hijo',
  imports: [],
  templateUrl: './hijo.html',
  styleUrl: './hijo.css',
})
export class Hijo {

  user: User = {nombre:"Juan", apellidos: "Vazquez Jimenez"}

}
