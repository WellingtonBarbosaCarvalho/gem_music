import React from 'react';
import AppRouter from './router/AppRouter';
import './styles/global.css';
import { CookiesProvider } from 'react-cookie';

const App = () => {
  return (
  <CookiesProvider>
    <AppRouter />
  </CookiesProvider>
)
};

export default App;
