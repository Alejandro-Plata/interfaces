import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatchesService } from 'src/app/services/matches-service';
import { ChatMessage, MatchDetail } from 'src/app/types/types';
import { SidebarComponent } from "src/app/components/sidebar/sidebar.component";
import { HeaderComponent } from "src/app/components/header/header.component";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-match-detail',
  templateUrl: './match-detail.component.html',
  styleUrls: ['./match-detail.component.scss'],
  imports: [SidebarComponent, HeaderComponent, FormsModule],
})
export class MatchDetailComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private matchesService = inject(MatchesService);

  standings = signal([
  { pos: 1, team: 'Real Madrid', played: 14, won: 11, drawn: 2, lost: 1, gf: 35, gc: 10, pts: 35, form: ['w','w','w','d','w'] },
  { pos: 2, team: 'Girona', played: 14, won: 11, drawn: 2, lost: 1, gf: 32, gc: 18, pts: 35, form: ['w','w','l','w','w'] },
  { pos: 3, team: 'Barcelona', played: 14, won: 9, drawn: 4, lost: 1, gf: 29, gc: 15, pts: 31, form: ['w','d','w','w','l'] },
  { pos: 4, team: 'Atlético', played: 13, won: 9, drawn: 1, lost: 3, gf: 30, gc: 12, pts: 28, form: ['w','l','w','w','w'] },
  { pos: 5, team: 'Athletic', played: 14, won: 7, drawn: 4, lost: 3, gf: 25, gc: 19, pts: 25, form: ['d','w','l','w','d'] },
]);

  match = signal<MatchDetail | null>(null);
  chatMessages = signal<ChatMessage[]>([]);
  newMessage = signal('');
  
  // Formulario de apuesta
  betAmount = signal<number | null>(null);
  predictionHome = signal<number | null>(null);
  predictionAway = signal<number | null>(null);

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.match.set(await this.matchesService.getMatchById(id));
      this.chatMessages.set(await this.matchesService.getChatMessages(id));
    }
  }

  sendMessage() {
    if (!this.newMessage().trim()) return;
    
    const msg: ChatMessage = {
      id: Date.now(),
      user: 'Yo', // Debería venir del AuthService
      avatar: 'assets/default-avatar.png',
      text: this.newMessage(),
      timestamp: new Date(),
      isMe: true
    };

    // Actualizamos señal del chat
    this.chatMessages.update(msgs => [...msgs, msg]);
    this.newMessage.set('');
    
    // Scroll al fondo (lógica visual opcional)
  }

  placeBet() {
    alert(`Apuesta realizada: ${this.betAmount()}€ al ${this.predictionHome()}-${this.predictionAway()}`);
  }
}
