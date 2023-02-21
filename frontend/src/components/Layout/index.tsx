import { Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';
import Header from '../Header';
import React, { FC } from 'react';

const useStyles = makeStyles(() => ({
   mainContainer: {
      display: 'flex',
   },
   contentContainer: {
      display: 'flex',
      padding: '0 20px',
   },
}));

interface ILayout {
   children: JSX.Element;
}

const Layout: FC<ILayout> = ({ children }) => {
   const classes = useStyles();

   return (
      <Grid container className={classes.mainContainer}>
         <Grid item xs={12}>
            <Header />
         </Grid>
         <Grid item xs={12} className={classes.contentContainer}>
            {children}
         </Grid>
      </Grid>
   );
};

export default Layout;
