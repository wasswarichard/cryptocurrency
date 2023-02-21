import React, { useEffect, useState } from 'react';
import { ColumnConfig, ITransaction } from '../../interface/types';
import { DataTable } from '../../components';
import { makeStyles } from '@mui/styles';
import DragHandleSharpIcon from '@mui/icons-material/DragHandleSharp';
import axios from 'axios';
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

const useStyles = makeStyles(() => ({
   inputs: {
      display: 'grid',
      gridTemplateColumns: 'repeat(6, 1fr)',
      gridGap: '2rem',
      marginTop: '1rem',
      '@media (max-width: 650px)': {
         gridTemplateColumns: '100%',
      },
   },
   display: {
      padding: '0 50px',
   },
}));

const columns: ColumnConfig[] = [
   { id: 'transactionDate', label: 'Date & Time', minWidth: 170 },
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

const Transactions = () => {
   const classes = useStyles();
   const [currencyFrom, setCurrencyFrom] = useState<string>('');
   const [currencyTo, setCurrencyTo] = useState<string>('USD');
   const [transactions, setTransactions] = useState<any>([]);
   const [rowsPerPage, setRowsPerPage] = useState<number>(10);
   const [page, setPage] = useState<number>(0);

   // useEffect(() => {
   //    (async () => {
   //       const transactions = axios.get(`http://localhost:3001/transactions`);
   //       console.log(transactions);
   //    })();
   // }, []);

   const handlePageChange = (event: unknown, newPage: number) => {
      setPage(newPage);
   };

   const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
   };

   return (
      <React.Fragment>
         <Grid container sx={{ mt: 3 }} className={classes.display}>
            <Grid item xs={12} sm={9}>
               <div className={classes.inputs}>
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
                              startAdornment={<InputAdornment position="start">$</InputAdornment>}
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
                     />
                  </FormControl>
                  <FormControl sx={{ maxWidth: 150, mt: 4 }}>
                     <Button variant="contained" fullWidth color="success" size="large">
                        Save
                     </Button>
                  </FormControl>
               </div>
            </Grid>

            <Grid item xs={12} sm={9} sx={{ mt: 3 }}>
               <DataTable
                  columns={columns}
                  keyColumn="index"
                  title="History"
                  data={transactions}
                  totalItems={transactions.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleChangeRowsPerPage}
               />
            </Grid>
         </Grid>
      </React.Fragment>
   );
};

export default Transactions;
