import React, { useEffect, useState } from 'react';
import { ColumnConfig } from '../../interface/types';
import { DataTable } from '../../components';
import DragHandleSharpIcon from '@mui/icons-material/DragHandleSharp';
import axios from 'axios';
import io, { Socket } from 'socket.io-client';
import Avatar from '@mui/material/Avatar';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import BitcoinLogo from '../../images/bitcoin.png';
import EthereumLogo from '../../images/ethereum.png';
import RippleLogo from '../../images/ripple.png';
import USALog from '../../images/usa.png';
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
   SelectChangeEvent,
   TextField,
} from '@mui/material';
import { DefaultEventsMap } from '@socket.io/component-emitter';

export const currencyOptions: readonly currencyOption[] = [
   {
      name: 'Bitcoin',
      value: 'BTC',
      src: BitcoinLogo,
   },
   {
      name: 'Ethereum',
      value: 'ETH',
      src: EthereumLogo,
   },
   {
      name: 'Ripple',
      value: 'XRP',
      src: RippleLogo,
   },
];

const columns: ColumnConfig[] = [
   {
      id: 'transactionDate',
      label: 'Date & Time',
      minWidth: 170,
      format: (value: number) =>
         new Date(parseInt(String(value))).toLocaleString('en-US', { hour12: false }),
   },
   {
      id: 'currencyFrom',
      label: 'Currency From',
      minWidth: 100,
      format: (value: string) => {
         const option = currencyOptions.filter((option) => option.value === value)[0];
         if (!option) return '';
         return option.name;
      },
   },
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
   {
      id: 'type',
      label: 'Type',
      minWidth: 100,
      format: (value: string) => {
         return value
            .toLowerCase()
            .split('_')
            .reduce((s, c) => s + '' + (c.charAt(0).toUpperCase() + c.slice(1) + ' '), '');
      },
      styles: (value: string) => {
         if (value === 'EXCHANGED') return { color: 'blue' };
         return { color: 'green' };
      },
   },
];

type currencyOption = {
   name: string;
   value: string;
   src: string;
};

const backendUrl = 'http://localhost:3001';
let socket: Socket<DefaultEventsMap, DefaultEventsMap>;
const Transactions = () => {
   const [transactions, setTransactions] = useState<any>([]);
   const [page, setPage] = useState(1);
   const [totalPages, setTotalPages] = useState<number>(1);
   const [submitError, setSubmitError] = useState(false);
   const [submitSuccess, setSubmitSuccess] = useState(false);

   const formik = useFormik({
      initialValues: {
         currencyFrom: '',
         amountFromValue: '',
         currencyTo: 'USD',
         amountToValue: '',
      },
      validationSchema: Yup.object({
         currencyFrom: Yup.string().required('Required'),
         currencyTo: Yup.string().required('Required'),
         amountFromValue: Yup.string().required('Required'),
         amountToValue: Yup.string().required('Required'),
      }),
      onSubmit: async (values) => {
         const response = await axios.post(`${backendUrl}/transactions`, {
            transactionDate: Date.now().toString(),
            currencyFrom: values.currencyFrom,
            amount1: values.amountFromValue,
            currencyTo: values.currencyTo,
            amount2: values.amountToValue,
            type: 'EXCHANGED',
         });
         if (response.status !== 201) setSubmitError(true);
         setSubmitSuccess(true);
      },
   });

   useEffect(() => {
      socket = io(backendUrl);
      return () => {
         socket.off();
      };
   }, [page]);

   useEffect(() => {
      (async () => {
         const result = await axios.get(`${backendUrl}/transactions/?page=${page}&limit=25`);
         setTransactions(result.data.transactions);
         setTotalPages(result.data.totalPages);
      })();
   }, [page]);

   useEffect(() => {
      socket.on('transaction.created', (message) => {
         setTransactions((previousState: any) => [message, ...previousState]);
      });
   }, []);

   const handleCurrencyFromOnChange = async (e: SelectChangeEvent<string>) => {
      const { data } = await axios.get(
         `${backendUrl}/transactions/rate/?currencyFrom=${e.target.value}&type=LIVE_PRICE`
      );
      await formik.setFieldValue('currencyFrom', e.target.value);
      await formik.setFieldValue('amountToValue', data.amount2.toString());
   };

   return (
      <React.Fragment>
         <Grid container sx={{ mt: 3 }} className="display">
            <Grid item xs={12} sm={9}>
               <form onSubmit={formik.handleSubmit} className="inputs">
                  <FormControl sx={{ maxWidth: 200, minWidth: 200 }}>
                     <Typography>Currency From</Typography>
                     <Select
                        id="currencyFrom"
                        name="currencyFrom"
                        value={formik.values.currencyFrom}
                        onChange={(e) => handleCurrencyFromOnChange(e)}
                        inputProps={{ 'aria-label': 'Without label' }}
                     >
                        {currencyOptions.map((option) => (
                           <MenuItem value={option.value} key={option.value}>
                              <Grid container spacing={1}>
                                 <Grid item xs={12} sm={3}>
                                    <Avatar
                                       alt={option.name}
                                       src={option.src}
                                       sx={{ width: 24, height: 24 }}
                                    />
                                 </Grid>
                                 <Grid item xs={12} sm={9}>
                                    {option.name}
                                 </Grid>
                              </Grid>
                           </MenuItem>
                        ))}
                     </Select>
                  </FormControl>
                  <FormControl sx={{ maxWidth: 200, minWidth: 250 }}>
                     <Grid container spacing={2}>
                        <Grid item xs={12} sm={9}>
                           <Typography>Amount</Typography>
                           <TextField
                              id="amountFromValue"
                              name="amountFromValue"
                              value={formik.values.amountFromValue}
                              onBlur={formik.handleBlur}
                              error={
                                 formik.touched.amountFromValue &&
                                 Boolean(formik.errors.amountFromValue)
                              }
                              helperText={
                                 formik.touched.amountFromValue && formik.errors.amountFromValue
                              }
                              onChange={(e) => {
                                 formik.setFieldValue('amountFromValue', e.target.value);
                                 formik.setFieldValue(
                                    'amountToValue',
                                    (
                                       parseFloat(formik.values.amountToValue) *
                                       parseFloat(e.target.value)
                                    ).toString()
                                 );
                              }}
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
                        id="currencyTo"
                        name="currencyTo"
                        value={formik.values.currencyTo}
                        onChange={formik.handleChange}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                        disabled={true}
                     >
                        {[
                           {
                              name: 'USD',
                              value: 'USD',
                              src: USALog,
                           },
                        ].map((option) => (
                           <MenuItem value={option.value} key={option.value}>
                              <Grid container spacing={1}>
                                 <Grid item xs={12} sm={3}>
                                    <Avatar
                                       alt={option.name}
                                       src={option.src}
                                       sx={{ width: 24, height: 24 }}
                                    />
                                 </Grid>
                                 <Grid item xs={12} sm={9}>
                                    {option.name}
                                 </Grid>
                              </Grid>
                           </MenuItem>
                        ))}
                     </Select>
                  </FormControl>
                  <FormControl sx={{ maxWidth: 200, minWidth: 200 }}>
                     <Typography>Amount</Typography>
                     <OutlinedInput
                        startAdornment={<InputAdornment position="start">$</InputAdornment>}
                        id="amountToValue"
                        name="amountToValue"
                        value={formik.values.amountToValue}
                        onChange={formik.handleChange}
                        disabled={true}
                     />
                  </FormControl>
                  <FormControl sx={{ maxWidth: 150, mt: 4 }}>
                     <Button color="primary" variant="contained" fullWidth type="submit">
                        Save
                     </Button>
                  </FormControl>
               </form>
            </Grid>
            <Grid item xs={12} sx={{ mt: 3, mb: 5 }}>
               <DataTable
                  columns={columns}
                  keyColumn="index"
                  title="History"
                  data={transactions}
                  totalItems={totalPages}
                  page={page}
                  setPage={setPage}
               />
            </Grid>
         </Grid>
      </React.Fragment>
   );
};

export default Transactions;
