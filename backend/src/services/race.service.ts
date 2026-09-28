import { Snail, RaceResult } from '../types';

const snails: Snail[] = [
  { id: 1, name: 'Rayo', odds: 1.5, color: 'Red' },
  { id: 2, name: 'Turbo', odds: 2.0, color: 'Blue' },
  { id: 3, name: 'Lento', odds: 3.5, color: 'Green' }
];

export const getAvailableSnails = (): Snail[] => {
  return snails;
};

export const runRace = (betSnailId: number, betAmount: number): RaceResult => {
  const randomIndex = Math.floor(Math.random() * snails.length);
  const winner = snails[randomIndex];

  const userWon = winner.id === betSnailId;
  const payout = userWon ? betAmount * winner.odds : 0;

  return {
    winnerId: winner.id,
    userWon,
    payout
  };
};