import { Body, Controller, Get, Post } from '@nestjs/common';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}
  @Post()
  async addTransaction(
    @Body('transactionDate') transactionDate: string,
    @Body('currencyFrom') currencyFrom: string,
    @Body('amount1') amount1: number,
    @Body('currencyTo') currencyTo: string,
    @Body('amount2') amount2: number,
    @Body('type') type: string,
  ) {
    const id = await this.transactionsService.insertTransaction(
      transactionDate,
      currencyFrom,
      amount1,
      currencyTo,
      amount2,
      type,
    );
    return { id };
  }

  @Get()
  async getAllTransactions() {
    return await this.transactionsService.getTransactions();
  }
}
