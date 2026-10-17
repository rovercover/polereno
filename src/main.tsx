import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import './index.css';
import { App } from './App';
import { MotionProvider } from './components/MotionProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <MotionProvider><App /></MotionProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
