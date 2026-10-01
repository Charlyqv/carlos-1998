import { describe, it, expect, beforeEach } from 'vitest';
import { transactionService, type SnailPayTransaction } from './transaction.service';

describe('Transaction Service - Integridad de Datos', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('Debe guardar exitosamente la tarjeta y el CVV ficticios en localStorage', () => {

    const mockTransaction: SnailPayTransaction = {
      id: 'mock-uuid-1234',
      status: 'approved',
      status_detail: 'accredited',
      transaction_amount: 500,
      date_created: new Date().toISOString(),
      authorization_code: '123456',
      reference: 'TEST-REF',
      payer_id: 'user-1',
      payer_email: 'carlos@test.com',
      cardNumber: '1234 1234 1234 1234',
      cvv: '123'
    };

    transactionService.saveTransaction(mockTransaction);

    const transactionsJson = localStorage.getItem('app_transactions');
    expect(transactionsJson).not.toBeNull();

    const savedTransactions = JSON.parse(transactionsJson as string);
    
    expect(savedTransactions.length).toBe(1);

    const lastTx = savedTransactions[0];
    expect(lastTx.cardNumber).toBe('1234 1234 1234 1234');
    expect(lastTx.cvv).toBe('123');
    expect(lastTx.status).toBe('approved');
  });
});