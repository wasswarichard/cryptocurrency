import { Grid } from '@mui/material';
import Header from '../Header';
import React, { FC } from 'react';
import './index.sass';

interface ILayout {
   children: JSX.Element;
}

const Layout: FC<ILayout> = ({ children }) => {
   return (
      <Grid container className="mainContainer">
         <Grid item xs={12}>
            <Header />
         </Grid>
         <Grid item xs={12} className="contentContainer">
            {children}
         </Grid>
      </Grid>
   );
};

export default Layout;
