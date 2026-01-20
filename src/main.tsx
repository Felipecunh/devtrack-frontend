import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom'; // Importando BrowserRouter

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

// Envolvendo o App com BrowserRouter
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
