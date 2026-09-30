export interface SnailPayTransaction {
  id: string;
  status: 'approved' | 'rejected' | 'error';
  status_detail: 'accredited' | 'insufficient_funds' | 'fraud_suspected' | 'internal_server_error';
  transaction_amount: number;
  date_created: string;
  authorization_code: string | null;
  reference: string;
  payer_id: string;
  payer_email: string;
  cardNumber: string;
  cvv: string;
}

const TRANSACTIONS_KEY = 'app_transactions';

export const transactionService = {
  
  saveTransaction: (transaction: SnailPayTransaction): void => {

    const existingTransactionsJson = localStorage.getItem(TRANSACTIONS_KEY);
    const transactions: SnailPayTransaction[] = existingTransactionsJson 
      ? JSON.parse(existingTransactionsJson) 
      : [];

    transactions.unshift(transaction);

    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
  },

  getUserTransactions: (userId: string): SnailPayTransaction[] => {
    const existingTransactionsJson = localStorage.getItem(TRANSACTIONS_KEY);
    if (!existingTransactionsJson) return [];
    
    const transactions: SnailPayTransaction[] = JSON.parse(existingTransactionsJson);
    return transactions.filter(t => t.payer_id === userId);
  }
};