export interface RegisterData {
    username: string;
    email: string;
    password: string;
}

export interface LoginData {
    username: string;
    password: string;
}

export interface Team {
  id: string;
  name: string;
  logoUrl: string; 
}

interface Score {
    home: number; 
    away: number 
}

export type Status = 'Próximos' | 'En vivo' | 'Finalizados'

export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  score: Score;
  status: Status;
  date: string; 
  matchday: number;
  lastScorer?: string;
  league: string; 
}

export interface MatchEvent {
  id: number;
  type: 'goal' | 'card';
  player: string;
  playerAvatar: string; // URL del avatar
  teamId: string; // 'home' o 'away'
  minute: number;
}

export interface ChatMessage {
  id: number;
  user: string;
  avatar: string; // URL avatar
  text: string;
  timestamp: Date;
  isMe?: boolean; // Para estilar diferente mis mensajes
}

// Extender Match para incluir eventos (mock)
export interface MatchDetail extends Match {
  events: MatchEvent[];
}

export interface TeamStats {
  position: number;
  teamId: string;
  teamName: string;
  logoUrl: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  gc: number;
  pts: number;
  form: ('w' | 'd' | 'l')[]; // Para los puntos de racha
}

export interface UserRank {
  id: number;
  username: string;
  avatar: string; // URL o nombre del asset
  points: number;
  position?: number; // Lo calcularemos en el front si no viene
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  avatarUrl: string;
  points: number;       // El saldo actual
  winRate: number;      // Porcentaje de victorias
  rank: string;
}