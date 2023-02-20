import * as mongoose from 'mongoose';

export const TransactionSchema = new mongoose.Schema({
  transactionDate: { type: String, required: true },
  currencyFrom: { type: String, required: true },
  amount1: { type: Number, required: true },
  currencyTo: { type: String, required: true },
  amount2: { type: Number, required: true },
  type: { type: String, required: true },
});

export interface Transaction {
  id: string;
  transactionDate: string;
  currencyFrom: string;
  amount1: number;
  currencyTo: string;
  amount2: number;
  type: string;
}
