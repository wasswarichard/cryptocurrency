import { Grid, Table, TableHead, TableRow, TableCell, TableBody, Typography } from '@mui/material';
import './index.sass';
import { ColumnConfig } from '../../interface/types';
import React, { FC, useState, useEffect } from 'react';
import { TablePagination } from '../../components';

interface IDataTable {
   columns: ColumnConfig[];
   keyColumn: string;
   title: JSX.Element | string;
   data: any[];
   totalItems: number;
}

const DataTable: FC<IDataTable> = ({ columns, keyColumn, title, data, totalItems }) => {
   const [displayData, setDisplayData] = useState<any>([]);
   const [page, setPage] = useState<number>(0);
   console.log(data);

   useEffect(() => {
      (async () => {
         const result = data?.map((transaction) => {
            return {
               ...transaction,
               transactionDate: new Date(parseInt(transaction.transactionDate)).toLocaleString(),
            };
         });
         setDisplayData(result);
      })();
   }, [data]);
   const onPageChange = (event: unknown, newPage: number) => {
      console.log('test');
      setPage(newPage);
   };

   return (
      <>
         <Grid item xs={12} className="dataTableTitle">
            <Typography> {title}</Typography>
         </Grid>
         <Grid item xs={12} className="dataTableContainer">
            <Table stickyHeader>
               <TableHead>
                  <TableRow>
                     {columns.map(({ id, label }: ColumnConfig) => (
                        <TableCell key={id} className="dataTableHeadCell">
                           <strong>{label}</strong>
                        </TableCell>
                     ))}
                  </TableRow>
               </TableHead>
               <TableBody>
                  {displayData.length > 0 &&
                     displayData.map((rowData: any) => {
                        return (
                           <TableRow key={rowData[keyColumn]}>
                              {columns.map(({ id }: ColumnConfig) => {
                                 return (
                                    <TableCell
                                       className="dataTableCell"
                                       key={id}
                                       style={{ color: 'green' }}
                                    >
                                       {rowData[id]}
                                    </TableCell>
                                 );
                              })}
                           </TableRow>
                        );
                     })}
               </TableBody>
            </Table>
         </Grid>
         <Grid item xs={3}>
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
