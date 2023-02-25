import { AppBar, Typography, Grid } from '@mui/material';
import React, { FC } from 'react';
import './index.sass';

export interface IHeaderProps {}

const Header: FC<IHeaderProps> = () => {
   return (
      <AppBar className="appBar">
         <Grid container className="headerContainer">
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
