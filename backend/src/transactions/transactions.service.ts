import { Injectable, NotFoundException } from '@nestjs/common';
import { Transaction } from './transaction.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel('Transaction')
    private readonly transactionModel: Model<Transaction>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async insertTransaction(
    transactionDate: string,
    currencyFrom: string,
    amount1: number,
    currencyTo: string,
    amount2: number,
    type: string,
  ) {
    const transaction = new this.transactionModel({
      transactionDate,
      currencyFrom,
      amount1,
      currencyTo,
      amount2,
      type,
    });
    const result = await transaction.save();
    this.eventEmitter.emit('transaction.created', result);
    return result.id as string;
  }

  async getTransactions() {
    return this.transactionModel.find().exec();
  }

  async getSingleTransaction(transactionId: string) {
    return await this.findTransaction(transactionId);
  }

  private async findTransaction(id: string): Promise<Transaction> {
    let transaction;
    try {
      transaction = await this.transactionModel.findById(id).exec();
    } catch (e) {
      throw new NotFoundException('Could not find transaction.');
    }

    if (!transaction) throw new NotFoundException('Could not find transaction');

    return transaction;
  }
  @Cron(CronExpression.EVERY_2_HOURS, { name: 'fetch_live_transactions' })
  async fetchLiveTransactions() {
    const response = await fetch(
      `${process.env.BACKEND_URL}/live?access_key=${process.env.BACKEND_URL_ACCESS_KEY}&symbols=BTC,ETH,XRP`,
    );
    const data = await response.json();
    const result = [];
    for (const [key, value] of Object.entries(data.rates)) {
      const payload = {
        transactionDate: data.timestamp,
        currencyFrom: key,
        amount1: 1,
        currencyTo: data.target,
        amount2: value,
        type: 'LIVE_PRICE',
      };
      result.push(payload);
    }
    result?.forEach((transaction) => {
      const {
        transactionDate,
        currencyFrom,
        amount1,
        currencyTo,
        amount2,
        type,
      } = transaction;
      this.insertTransaction(
        transactionDate,
        currencyFrom,
        amount1,
        currencyTo,
        amount2,
        type,
      );
    });
  }

  @OnEvent('transaction.created')
  async publishTransaction(transaction) {
    console.log(transaction);
  }
}
