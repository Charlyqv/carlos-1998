import { Request, Response } from 'express';
import { processRecharge } from './snailpay.controller';
import { SnailPayRequest } from '../types';
import { describe, it, expect, jest } from '@jest/globals';

describe('SnailPay Controller - Lógica de Negocio', () => {

  it('Debe rechazar la recarga por fondos insuficientes si la tarjeta termina en 5151', async () => {
    
    const mockPayload: SnailPayRequest = {
      userId: 'user-123',
      email: 'carlos@test.com',
      amount: 500,
      fullName: 'Carlos V',
      cardNumber: '4111 1111 1111 5151',
      expirationDate: '12/28',
      cvv: '123'
    };

    const req = {
      body: mockPayload
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()                    
    } as unknown as Response;

    await processRecharge(req, res);

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'rejected',
        status_detail: 'insufficient_funds',
        transaction_amount: 500,
        cardNumber: '4111 1111 1111 5151'
      })
    );
  });

});