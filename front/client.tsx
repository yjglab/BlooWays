import axios from 'axios';
import 'core-js/stable';
import './styles/globals.css';
import React from 'react';
import App from './layouts/App';
import CreateDOM from 'react-dom/client';

axios.defaults.withCredentials = true;
axios.defaults.baseURL =
  process.env.NODE_ENV === 'production' ? 'https://blooways.com' : 'http://localhost:4090';

const app = CreateDOM.createRoot(document.querySelector('#app')!);
app.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
