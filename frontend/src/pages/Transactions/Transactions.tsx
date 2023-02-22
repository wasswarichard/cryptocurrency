import React, { useEffect, useState } from 'react';
import { ColumnConfig } from '../../interface/types';
import { DataTable } from '../../components';
import DragHandleSharpIcon from '@mui/icons-material/DragHandleSharp';
import axios from 'axios';
import io, { Socket } from 'socket.io-client';
import './Transactions.sass';
import {
   Grid,
   MenuItem,
   FormControl,
   Select,
   Typography,
   OutlinedInput,
   InputAdornment,
   Button,
} from '@mui/material';
import { DefaultEventsMap } from '@socket.io/component-emitter';

const columns: ColumnConfig[] = [
   {
      id: 'transactionDate',
      label: 'Date & Time',
      minWidth: 170,
      format: (value: number) => new Date(value).toLocaleString(),
   },
   { id: 'currencyFrom', label: 'Currency From', minWidth: 100 },
   {
      id: 'amount1',
      label: 'Amount1',
      minWidth: 170,
      align: 'right',
      format: (value: number) => value.toLocaleString('en-US'),
   },
   { id: 'currencyTo', label: 'Currency To', minWidth: 100 },
   {
      id: 'amount2',
      label: 'Amount2',
      minWidth: 170,
      align: 'right',
      format: (value: number) => value.toLocaleString('en-US'),
   },
   { id: 'type', label: 'Type', minWidth: 100 },
];

type currencyOption = {
   name: string;
   value: string;
   symbol?: string;
};
const currencyOptions: readonly currencyOption[] = [
   {
      name: 'Bitcoin',
      value: 'BTC',
   },
   {
      name: 'Ethereum',
      value: 'ETH',
   },
   {
      name: 'Ripple',
      value: 'XRP',
   },
];

const backendUrl = 'http://localhost:3001';
let socket: Socket<DefaultEventsMap, DefaultEventsMap>;
const Transactions = () => {
   const [currencyFrom, setCurrencyFrom] = useState<string>('');
   const [currencyTo, setCurrencyTo] = useState<string>('USD');
   const [amountToValue, setAmountToValue] = useState<string>('');
   const [amountFromValue, setAmountFromValue] = useState<string>('');
   const [transactions, setTransactions] = useState<any>([]);

   useEffect(() => {
      (async () => {
         const transactions = await axios.get(`${backendUrl}/transactions`);
         setTransactions(transactions.data);
      })();
      socket = io(backendUrl);
      return () => {
         socket.off();
      };
   }, []);

   useEffect(() => {
      socket.on('transaction.created', (message) => {
         console.log(message)
         setTransactions((previousState: any) => {
            return {
               ...previousState,
               ...[message]
            };
         });
      });
   }, []);

   useEffect(() => {
      console.log(currencyFrom);
   }, [currencyFrom]);

   const handleOnChange = async () => {
      try {
         const response = await axios.post(`${backendUrl}/transactions`, {
            transactionDate: Date.now().toString(),
            currencyFrom,
            amount1: amountFromValue,
            currencyTo,
            amount2: amountToValue,
            type: 'EXCHANGED',
         });
      }catch (e){
         console.log(e)
      }
   };

   return (
      <React.Fragment>
         <Grid container sx={{ mt: 3 }} className="display">
            <Grid item xs={12} sm={9}>
               <div className="inputs">
                  <FormControl sx={{ maxWidth: 200, minWidth: 200 }}>
                     <Typography>Currency From</Typography>
                     <Select
                        value={currencyFrom}
                        onChange={(e) => setCurrencyFrom(e.target.value)}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                     >
                        {currencyOptions.map((option) => (
                           <MenuItem value={option.value} key={option.value}>
                              {option.name}
                           </MenuItem>
                        ))}
                     </Select>
                  </FormControl>
                  <FormControl sx={{ maxWidth: 200, minWidth: 250 }}>
                     <Grid container spacing={2}>
                        <Grid item xs={12} sm={9}>
                           <Typography>Amount</Typography>
                           <OutlinedInput
                              id="outlined-adornment-amount"
                              onChange={(e) => setAmountFromValue(e.target.value)}
                           />
                        </Grid>
                        <Grid item xs={12} sm={3} sx={{ mt: 5 }}>
                           <DragHandleSharpIcon />
                        </Grid>
                     </Grid>
                  </FormControl>
                  <FormControl sx={{ maxWidth: 200, minWidth: 200 }}>
                     <Typography>Currency To</Typography>
                     <Select
                        value={currencyTo}
                        onChange={(e) => setCurrencyTo(e.target.value)}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                        disabled={true}
                     >
                        <MenuItem value={currencyTo}>USD</MenuItem>
                     </Select>
                  </FormControl>
                  <FormControl sx={{ maxWidth: 200, minWidth: 200 }}>
                     <Typography>Amount</Typography>
                     <OutlinedInput
                        id="outlined-adornment-amount"
                        startAdornment={<InputAdornment position="start">$</InputAdornment>}
                        onChange={(e) => setAmountToValue(e.target.value)}
                     />
                  </FormControl>
                  <FormControl sx={{ maxWidth: 150, mt: 4 }}>
                     <Button
                        variant="contained"
                        fullWidth
                        color="success"
                        size="large"
                        onClick={() => handleOnChange()}
                     >
                        Save
                     </Button>
                  </FormControl>
               </div>
            </Grid>

            <Grid item xs={12} sx={{ mt: 3, mb: 5 }}>
               <DataTable
                  columns={columns}
                  keyColumn="index"
                  title="History"
                  data={transactions}
                  totalItems={transactions.length}
               />
            </Grid>
         </Grid>
      </React.Fragment>
   );
};

export default Transactions;
