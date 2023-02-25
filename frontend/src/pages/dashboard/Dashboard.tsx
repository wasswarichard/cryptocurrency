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
import './Dashboard.sass';
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
   Snackbar,
} from '@mui/material';
import { DefaultEventsMap } from '@socket.io/component-emitter';

import MuiAlert, { AlertProps } from '@mui/material/Alert';
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
   return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

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

const backendUrl = `${process.env.REACT_APP_BACKEND_URL}`;
let socket: Socket<DefaultEventsMap, DefaultEventsMap>;

const Dashboard = () => {
   const [transactions, setTransactions] = useState<any>([]);
   const [page, setPage] = useState(1);
   const [totalPages, setTotalPages] = useState<number>(1);
   const [submitSuccess, setSubmitSuccess] = useState(false);
   const [exchangeRate, setExchangeRate] = useState<number>(1);

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
         if (response.status !== 201) {
            console.log(response);
            return;
         }
         setSubmitSuccess(true);
         formik.resetForm();
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
      setExchangeRate(parseFloat(data.amount2));
   };

   const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === 'clickaway') {
         return;
      }
      setSubmitSuccess(false);
   };

   return (
      <React.Fragment>
         <Grid container className="display">
            <Grid item xs={12} sm={9}>
               <form onSubmit={formik.handleSubmit} className="inputs">
                  <FormControl sx={{ maxWidth: 200, minWidth: 200 }} size="small">
                     <Typography>Currency From</Typography>
                     <Select
                        id="currencyFrom"
                        name="currencyFrom"
                        value={formik.values.currencyFrom}
                        onChange={(e) => handleCurrencyFromOnChange(e)}
                        inputProps={{ 'aria-label': 'Without label' }}
                        required={true}
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
                              size="small"
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
                                    (exchangeRate * parseFloat(e.target.value)).toString()
                                 );
                              }}
                           />
                        </Grid>
                        <Grid item xs={12} sm={3} sx={{ mt: 4 }}>
                           <DragHandleSharpIcon />
                        </Grid>
                     </Grid>
                  </FormControl>
                  <FormControl sx={{ maxWidth: 200, minWidth: 200 }} size="small">
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
                  <FormControl sx={{ maxWidth: 200, minWidth: 200 }} size="small">
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
                  <FormControl sx={{ maxWidth: 150, mt: 3 }}>
                     <Button
                        variant="contained"
                        fullWidth
                        type="submit"
                        style={{ backgroundColor: 'green' }}
                     >
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
         <Snackbar
            open={submitSuccess}
            autoHideDuration={6000}
            onClose={handleClose}
            anchorOrigin={{
               vertical: 'top',
               horizontal: 'center',
            }}
         >
            <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
               Exchange submitted
            </Alert>
         </Snackbar>
      </React.Fragment>
   );
};

export default Dashboard;
