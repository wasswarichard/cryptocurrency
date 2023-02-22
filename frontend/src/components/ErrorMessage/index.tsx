import { Cancel as ErrorIcon } from '@mui/icons-material';
import { Typography, Grid } from '@mui/material';
import React from 'react';
import './index.sass';

interface Props {
   message?: string;
}

const ErrorMessage = ({ message }: Props) => {
   return (
      <Grid container className="container">
         <Grid item className="errorIconContainer">
            <ErrorIcon />
         </Grid>
         <Grid item>
            <Typography variant="body1">
               {message || 'Something went wrong. Please try again.'}
            </Typography>
         </Grid>
      </Grid>
   );
};

export default ErrorMessage;
