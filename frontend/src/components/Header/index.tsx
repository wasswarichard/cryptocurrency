import { AppBar, Typography, Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React, { FC } from 'react';

const useStyles = makeStyles(() => ({
   appBar: {
      height: '70px',
      width: '100%',
   },
   headerContainer: {
      display: 'flex',
      alignItems: 'center',
      height: '100%',
      padding: '0 50px',
   },
}));

export interface IHeaderProps {}

const Header: FC<IHeaderProps> = () => {
   const classes = useStyles();

   return (
      <AppBar position="relative" className={classes.appBar}>
         <Grid container className={classes.headerContainer}>
            <Grid item xs={12}>
               <Typography variant="h4" data-testid="company-logo">
                  Exchange
               </Typography>
            </Grid>
         </Grid>
      </AppBar>
   );
};

export default Header;
