export type RangoMision = 'D' | 'C' | 'B' | 'A' | 'S';

export interface Mision {
  code: string;        
  rank: RangoMision;
  agent: string;     
  objective: string;   
  date: string;        
}