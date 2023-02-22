import React from 'react';
import { Breadcrumbs, Typography } from '@mui/material/';
import { NavigateNext } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import './index.sass';

interface Breadcrumb {
   label: string;
   navigateTo: string;
}

interface Props {
   data: Breadcrumb[];
}

const BreadcrumbsWrapper = ({ data }: Props) => {
   return (
      <Breadcrumbs separator={<NavigateNext fontSize="small" />} className="breadcrumbs">
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
