import { Injectable } from '@angular/core';
import { ChatMessage, Match, MatchDetail, TeamStats } from '../types/types';

@Injectable({
  providedIn: 'root',
})
export class MatchesService {
  // Mock para simular la API
  async getMatchById(id: string): Promise<MatchDetail> {
    // Simula delay de red
    await new Promise(r => setTimeout(r, 500));
    
    return {
      id: id,
      homeTeam: { id: 'rm', name: 'Real Madrid', logoUrl: 'assets/pack-escudos/real_madrid.png' },
      awayTeam: { id: 'bar', name: 'Barcelona', logoUrl: 'assets/pack-escudos/fc_barcelona.png' },
      score: { home: 1, away: 1 },
      status: 'Finalizado', // Cambia a 'upcoming' para probar el formulario
      date: new Date().toISOString(),
      matchday: 14,
      league: 'La Liga',
    } as unknown as MatchDetail;
  }

  async getChatMessages(matchId: string): Promise<ChatMessage[]> {
    return [
      { id: 1, user: 'CryptoKing', avatar: 'assets/avatars/1.png', text: '¡Vaya golazo!', timestamp: new Date() },
      { id: 2, user: 'MollyFan', avatar: 'assets/avatars/2.png', text: 'El árbitro está comprado...', timestamp: new Date() }
    ];
  }

  async getStandings(): Promise<TeamStats[]> {
    return [
      { position: 1, teamId: 'rm', teamName: 'Real Madrid', logoUrl: 'assets/pack-escudos/real_madrid.png', played: 14, won: 11, drawn: 2, lost: 1, gf: 35, gc: 10, pts: 35, form: ['w','w','w','d','w'] },
      { position: 2, teamId: 'gir', teamName: 'Girona', logoUrl: 'assets/pack-escudos/girona.png', played: 14, won: 11, drawn: 2, lost: 1, gf: 32, gc: 18, pts: 35, form: ['w','w','l','w','w'] },
      { position: 3, teamId: 'bar', teamName: 'Barcelona', logoUrl: 'assets/pack-escudos/fc_barcelona.png', played: 14, won: 9, drawn: 4, lost: 1, gf: 29, gc: 15, pts: 31, form: ['w','d','w','w','l'] },
      { position: 4, teamId: 'atm', teamName: 'Atlético', logoUrl: 'assets/pack-escudos/atletico.png', played: 13, won: 9, drawn: 1, lost: 3, gf: 30, gc: 12, pts: 28, form: ['w','l','w','w','w'] },
      { position: 5, teamId: 'ath', teamName: 'Athletic', logoUrl: 'assets/pack-escudos/athletic.png', played: 14, won: 7, drawn: 4, lost: 3, gf: 25, gc: 19, pts: 25, form: ['d','w','l','w','d'] },
      { position: 6, teamId: 'soc', teamName: 'Real Sociedad', logoUrl: 'assets/pack-escudos/realsociedad.png', played: 14, won: 7, drawn: 4, lost: 3, gf: 23, gc: 18, pts: 25, form: ['w','d','w','l','d'] },
      // ... más equipos
    ];
  }

  // Mock de Partidos (Devuelve partidos aleatorios según la jornada pedida)
  async getMatchesByMatchday(day: number): Promise<Match[]> {
    // Simulamos que cargan datos distintos
    return [
      {
        id: `m${day}-1`,
        homeTeam: { id: 'rm', name: 'Real Madrid', logoUrl: 'assets/pack-escudos/real_madrid.png' },
        awayTeam: { id: 'bar', name: 'Barcelona', logoUrl: 'assets/pack-escudos/fc_barcelona.png' },
        score: { home: Math.floor(Math.random() * 4), away: Math.floor(Math.random() * 3) },
        status: 'Finalizados', // Usamos clave en inglés internamente
        date: new Date().toISOString(),
        matchday: day,
        league: 'La Liga'
      },
      {
        id: `m${day}-2`,
        homeTeam: { id: 'sev', name: 'Sevilla', logoUrl: 'assets/pack-escudos/sevilla.png' },
        awayTeam: { id: 'bet', name: 'Betis', logoUrl: 'assets/pack-escudos/betis.png' },
        score: { home: 1, away: 1 },
        status: 'Finalizados',
        date: new Date().toISOString(),
        matchday: day,
        league: 'La Liga'
      },
      {
        id: `m${day}-3`,
        homeTeam: { id: 'val', name: 'Valencia', logoUrl: 'assets/pack-escudos/valencia.png' },
        awayTeam: { id: 'vil', name: 'Villarreal', logoUrl: 'assets/pack-escudos/villarreal.png' },
        score: { home: 2, away: 0 },
        status: 'Finalizados',
        date: new Date().toISOString(),
        matchday: day,
        league: 'La Liga'
      },
      {
        id: `m${day}-4`,
        homeTeam: { id: 'atm', name: 'Atlético', logoUrl: 'assets/pack-escudos/atletico.png' },
        awayTeam: { id: 'osa', name: 'Osasuna', logoUrl: 'assets/pack-escudos/osasuna.png' },
        score: { home: 3, away: 0 },
        status: 'Finalizados',
        date: new Date().toISOString(),
        matchday: day,
        league: 'La Liga'
      }
    ];
  }
}
