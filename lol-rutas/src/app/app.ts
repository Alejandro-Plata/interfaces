import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Padre } from "./padre/padre";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Padre],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('lol-rutas');
}
