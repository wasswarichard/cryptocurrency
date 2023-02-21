import { Grid, Typography } from '@mui/material/';
import { makeStyles } from '@mui/styles';
import { Link } from 'react-router-dom';
import React, { FC } from 'react';

const useStyles = makeStyles(() => ({
   container: {
      width: '100%',
      minHeight: '700px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
   },

   dashboardLink: {
      marginTop: '30px',
   },
}));

export interface IPageNotFound {}
const PageNotFound: FC<IPageNotFound> = () => {
   const classes = useStyles();

   return (
      <Grid container className={classes.container}>
         <Typography variant="h5">Page not found</Typography>
         <Typography variant="body1" className={classes.dashboardLink}>
            <Link to="/">Go to dashboard</Link>
         </Typography>
      </Grid>
   );
};

export default PageNotFound;
