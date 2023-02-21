export interface ITransactionDetails {
   size: string;
   prev_block: string;
   hash: string;
   next_block: string;
   weight: string;
}

export interface ITransaction {
   hash: string;
   block_index: string;
   height: number;
   time: number;
}

export interface ITransactionModalProps {
   openModal: boolean;
   hash: string;
   handleClose: (value: boolean) => void;
}

export interface ColumnConfig {
   id: string;
   label: string;
   minWidth?: number;
   align?: 'right';
   format?: (value: number) => string;
}

export interface PaginatedResult<T> {
   items: T[];
   totalPages: number;
   totalItems: number;
}

export interface Transaction {
   hash: string;
   size: number;
   blockHeight: number;
   index: number;
   relayedBy: number;
}

export interface Block {
   hash: string;
   height: number;
   time: number;
   index: number;
   size: number;
   previousBlock?: string;
   transactions?: PaginatedResult<Transaction>;
}
