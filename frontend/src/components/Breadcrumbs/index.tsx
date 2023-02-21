import React from 'react';
import { Breadcrumbs, Typography } from '@mui/material/';
import { makeStyles } from '@mui/styles';
import { NavigateNext } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { themeVariables } from '../../utils/theme';

const useStyles = makeStyles(() => ({
   breadcrumbs: {
      '& a': {
         textDecoration: 'none',
         color: themeVariables.colors.lightGray,

         '&:hover': {
            color: themeVariables.colors.gray,
         },
      },
   },
}));

interface Breadcrumb {
   label: string;
   navigateTo: string;
}

interface Props {
   data: Breadcrumb[];
}

const BreadcrumbsWrapper = ({ data }: Props) => {
   const classes = useStyles();

   return (
      <Breadcrumbs separator={<NavigateNext fontSize="small" />} className={classes.breadcrumbs}>
         {data.map(({ label, navigateTo }: Breadcrumb, index: number) => (
            <Link to={navigateTo} key={label}>
               <Typography
                  variant="body1"
                  color={index === data.length - 1 ? 'textPrimary' : 'initial'}
               >
                  {label}
               </Typography>
            </Link>
         ))}
      </Breadcrumbs>
   );
};

export default BreadcrumbsWrapper;
