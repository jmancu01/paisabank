export interface Card {
  id: number;
  created_at?: Date;
  balance: number;
  card_number: number;
  name: string;
  expiry_date: string;
  currency: string; // Defaults to 'USD'
  issuer: string;
  user: string;
}

export enum TransactionType {
  PURCHASE = 'purchase',
  REFUND = 'refund',
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
  TRANSFER = 'transfer',
  FEE = 'fee',
}

export interface Transaction {
  id: number;
  created_at: Date;
  title: string;
  amount: number;
  type: TransactionType;
  date: Date;
  card: number; // Foreign key reference to cards.id
  user: string;
}
