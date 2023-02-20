import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionSchema } from './transaction.model';
import { TransactionsGateway } from './transactions.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Transaction', schema: TransactionSchema },
    ]),
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService, TransactionsGateway],
})
export class TransactionsModule {}
