import { Cancel as ErrorIcon } from '@mui/icons-material';
import { Typography, Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { themeVariables } from '../../utils/theme';
import React from 'react';

const useStyles = makeStyles(() => ({
   container: {
      width: '400px',
      height: '50px',
      display: 'flex',
      alignItems: 'center',
      border: `1px solid ${themeVariables.colors.red}`,
      padding: '0 20px',
      marginTop: '50px',
   },
   errorIconContainer: {
      paddingRight: '10px',

      '& svg': {
         color: themeVariables.colors.red,
      },
   },
}));

interface Props {
   message?: string;
}

const ErrorMessage = ({ message }: Props) => {
   const classes = useStyles();

   return (
      <Grid container className={classes.container}>
         <Grid item className={classes.errorIconContainer}>
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
