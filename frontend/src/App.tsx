import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import {Layout} from "./components";
import {useTheme} from "./utils/theme";
import RoutePaths from './Routes';

function App() {
   const { theme } = useTheme();

   return (
      <ThemeProvider theme={theme}>
         <Layout>
            <RoutePaths />
         </Layout>
      </ThemeProvider>
   );
}

export default App;
