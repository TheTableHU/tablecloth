import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// Create a div element with id 'app'
const container = document.createElement('div');
container.id = 'app';
document.body.appendChild(container);

const root = createRoot(container); // createRoot(container!) if you use TypeScript

root.render(
  <BrowserRouter>
    <App tab="home" />
  </BrowserRouter>,
);
