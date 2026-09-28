export interface Snail {
  id: number;
  name: string;
  odds: number; // La cuota de la apuesta (ej: 2.5 significa que ganas 2.5x tu apuesta)
  color: string;
}

export interface BetRequest {
  snailId: number;
  amount: number;
}

export interface RaceResult {
  winnerId: number;
  userWon: boolean;
  payout: number;
}