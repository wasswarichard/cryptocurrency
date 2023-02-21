import React, { useEffect, useState } from 'react';
// import './Transactions.sass';
import { ITransaction } from '../../interface/types';

interface Column {
   id: 'hash' | 'block_index' | 'height' | 'time';
   label: string;
   minWidth?: number;
   align?: 'right';
   format?: (value: number) => string;
}

const columns: readonly Column[] = [
   { id: 'hash', label: 'Hash', minWidth: 170 },
   { id: 'block_index', label: 'Block Index', minWidth: 100 },
   {
      id: 'height',
      label: 'Height',
      minWidth: 170,
      align: 'right',
      format: (value: number) => value.toLocaleString('en-US'),
   },
   {
      id: 'time',
      label: 'Time',
      minWidth: 170,
      align: 'right',
      format: (value: number) => value.toLocaleString('en-US'),
   },
];

const Transactions = () => {
   const [page, setPage] = React.useState(0);
   const [rowsPerPage, setRowsPerPage] = React.useState(10);
   const [transactions, setTransactions] = useState<ITransaction[]>([]);
   const [hash, setHash] = useState<string>('');
   const [openModal, setOpenModal] = useState<boolean>(false);

   const handleClose = () => setOpenModal(false);
   const previewModal = (transaction: ITransaction) => {
      setHash(transaction.hash);
      setOpenModal(true);
   };

   const handleChangePage = (event: unknown, newPage: number) => {
      setPage(newPage);
   };

   const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
   };

   return <h1>Test</h1>;
};

export default Transactions;
