import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Match } from 'src/app/types/types';

@Component({
  selector: 'app-match-card',
  templateUrl: './match-card.component.html',
  styleUrls: ['./match-card.component.scss'],
  imports: [RouterLink]
})
export class MatchCardComponent {

  @Input() match!: Match;
}
