import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.html',
  styleUrls: ['./projects.css']
})
export class Projects {
 
  projects = [
    {
      image: 'assets/images/buscaminas.png',
      imageAlt: 'Imagen del proyecto Buscaminas en Java',
      title: 'Buscaminas',
      description:
        'Recreación del clásico Buscaminas implementando algoritmos de recursividad (Flood Fill) ' +
        'para el descubrimiento de celdas vacías, manejo de matrices bidimensionales y desarrollo de lógica de programación.',
      githubLink:
        'https://github.com/Alejandro-Plata/Personal-repo/tree/main/Buscaminas',
      tech: ['Java', 'Algoritmia', 'CLI']
    },
    {
      title: 'Lights Out',
      description:
        'Juego de puzzles matemático donde la inversión de estados binarios simula el encendido/apagado de luces adyacentes. Basado en lógica de programación orientada a objetos.',
      image: 'assets/images/lightsout.png',
      github: 'https://github.com/Alejandro-Plata/Personal-repo/tree/main/Lights%20Out',
      tech: ['Java', 'Lógica Matemática', 'POO']
    },
    {
      title: 'Yu-Gi-Oh! Deck Master',
      description:
        'Aplicación Android nativa que consume una API pública REST para consultar cartas, visualizarlas y guardar tus favoritas en tu propio mazo. Uso de adaptadores y peticiones asíncronas.',
      image: 'assets/images/yugioh.png',
      github: 'https://github.com/Alejandro-Plata/android',
      tech: ['Android Studio', 'Java', 'REST API']
    },
  ]

}