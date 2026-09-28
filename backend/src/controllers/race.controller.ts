import { Request, Response } from 'express';
import * as raceService from '../services/race.service';
import { BetRequest } from '../types';

export const getSnails = (req: Request, res: Response) => {
  const snails = raceService.getAvailableSnails();
  res.status(200).json(snails);
};

export const placeBet = (req: Request, res: Response): any => {
  const { snailId, amount } = req.body as BetRequest;

  if (!snailId || amount === undefined) {
    return res.status(400).json({ message: 'Faltan datos de la apuesta.' });
  }

  if (amount <= 0) {
    return res.status(400).json({ message: 'El monto de la apuesta debe ser mayor a 0.' });
  }

  const validSnailIds = raceService.getAvailableSnails().map(s => s.id);
  if (!validSnailIds.includes(snailId)) {
    return res.status(404).json({ message: 'El caracol seleccionado no existe.' });
  }

  const result = raceService.runRace(snailId, amount);
  
  res.status(200).json(result);
};