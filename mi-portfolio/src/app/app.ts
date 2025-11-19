import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Footer } from "./components/footer/footer";
import { Holograma } from "./components/holograma/holograma";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, Holograma],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('mi-portfolio');
}
