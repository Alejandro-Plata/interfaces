import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Holograma } from '../../../components/holograma/holograma'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, Holograma],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {}