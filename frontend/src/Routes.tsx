import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { PageNotFound } from './components';
import Dashboard from './pages/dashboard/Dashboard';
import React, { FC } from 'react';

export interface IRoutePathsProps {}

const RoutePaths: FC<IRoutePathsProps> = () => {
   return (
      <Router>
         <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="*" element={<PageNotFound />} />
         </Routes>
      </Router>
   );
};

export default RoutePaths;
