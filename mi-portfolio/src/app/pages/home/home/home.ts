import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {}