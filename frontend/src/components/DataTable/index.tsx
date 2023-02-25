import {
   Grid,
   Table,
   TableHead,
   TableRow,
   TableCell,
   TableBody,
   Typography,
   Button,
   Select,
   MenuItem,
   FormControl,
   TextField,
   TextFieldProps,
} from '@mui/material';
import './index.sass';
import { ColumnConfig } from '../../interface/types';
import React, { FC, useState, useEffect } from 'react';
import { TablePagination } from '../../components';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { currencyOptions } from '../../pages/dashboard/Dashboard';

interface IDataTable {
   page: number;
   setPage: any;
   columns: ColumnConfig[];
   keyColumn: string;
   title: JSX.Element | string;
   data: any[];
   totalItems: number;
}

const DataTable: FC<IDataTable> = ({
   page,
   setPage,
   columns,
   keyColumn,
   title,
   data,
   totalItems,
}) => {
   const [displayData, setDisplayData] = useState<any>([]);

   const [type, setType] = useState('ALL');
   const [fromDate, setFromDate] = useState(dayjs(new Date()));
   const [toDate, setToDate] = useState(dayjs(new Date()));

   useEffect(() => {
      setDisplayData(data);
   }, [data]);

   const filterTransactions = () => {
      let transactions;
      const fromDateTime = new Date(dayjs(fromDate).format('LLLL')).getTime();
      const toDateTime = new Date(dayjs(toDate).format('LLLL')).getTime();
      const result = data.filter((transaction: any) => {
         return (
            parseInt(transaction.transactionDate) >= parseInt(String(fromDateTime)) &&
            parseInt(transaction.transactionDate) <= parseInt(String(toDateTime))
         );
      });
      if (type !== 'ALL') {
         transactions = result.filter((transaction) => transaction.currencyFrom === type);
      } else {
         transactions = result;
      }
      setDisplayData(transactions);
   };
   const onPageChange = (newPage: number) => {
      setPage(newPage);
   };

   return (
      <>
         <Grid item xs={12} className="dataTableTitle">
            <Typography style={{ fontWeight: 'bold' }}> {title}</Typography>
         </Grid>
         <Grid item xs={12} className="filters">
            <FormControl sx={{ maxWidth: 150, minWidth: 150 }} size="small">
               <Typography>From date</Typography>
               <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                     inputFormat="MM/DD/YYYY"
                     value={fromDate}
                     onChange={(e: React.SetStateAction<any>) => setFromDate(e)}
                     renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => (
                        <TextField {...params} size="small" />
                     )}
                  />
               </LocalizationProvider>
            </FormControl>
            <FormControl sx={{ maxWidth: 150, minWidth: 150 }} size="small">
               <Typography>To date</Typography>
               <LocalizationProvider dateAdapter={AdapterDayjs} size="small">
                  <DatePicker
                     inputFormat="MM/DD/YYYY"
                     value={toDate}
                     minDate={dayjs(fromDate)}
                     onChange={(e: React.SetStateAction<any>) => setToDate(e)}
                     renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => (
                        <TextField {...params} size="small" />
                     )}
                  />
               </LocalizationProvider>
            </FormControl>
            <FormControl sx={{ maxWidth: 150, minWidth: 150 }} size="small">
               <Typography>Type</Typography>
               <Select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  inputProps={{ 'aria-label': 'Without label' }}
               >
                  {[{ name: 'All', value: 'ALL' }, ...currencyOptions].map((option) => (
                     <MenuItem value={option.value} key={option.value}>
                        {option.name}
                     </MenuItem>
                  ))}
               </Select>
            </FormControl>
            <FormControl sx={{ maxWidth: 150, mt: 3 }}>
               <Button fullWidth variant="outlined" color="info" onClick={filterTransactions}>
                  Filter
               </Button>
            </FormControl>
         </Grid>
         <Grid item xs={12} className="dataTableContainer" sx={{ mt: 3 }}>
            <Table stickyHeader>
               <TableHead>
                  <TableRow>
                     {columns.map(({ id, label }: ColumnConfig) => (
                        <TableCell
                           key={id}
                           className="dataTableHeadCell"
                           style={{ backgroundColor: 'lightgrey' }}
                        >
                           <strong>{label}</strong>
                        </TableCell>
                     ))}
                  </TableRow>
               </TableHead>
               <TableBody>
                  {displayData.length > 0 &&
                     displayData.map((rowData: any, index: number) => {
                        return (
                           <TableRow
                              key={rowData[keyColumn]}
                              style={
                                 index % 2
                                    ? { backgroundColor: 'lightgrey' }
                                    : { backgroundColor: 'white' }
                              }
                           >
                              {columns.map(({ id, format, styles }: ColumnConfig) => {
                                 return (
                                    <TableCell
                                       className="dataTableCell"
                                       key={id}
                                       style={styles && styles(rowData[id])}
                                    >
                                       {format ? format(rowData[id]) : rowData[id]}
                                    </TableCell>
                                 );
                              })}
                           </TableRow>
                        );
                     })}
               </TableBody>
            </Table>
         </Grid>
         <Grid item xs={12} sm={3}>
            <TablePagination
               pages={totalItems}
               page={page}
               onPageChange={onPageChange}
               previousText="Previous"
               nextText="Next"
            />
         </Grid>
      </>
   );
};

export default DataTable;
