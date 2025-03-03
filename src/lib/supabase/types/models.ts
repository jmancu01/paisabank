import { Card, Transaction } from './tables';

export interface CardWithTransactions extends Card {
  transactions?: Transaction[];
}

export interface TransactionWithCard extends Transaction {
  cardDetails?: Card;
}
