import axios from 'axios';
import 'core-js/stable';
import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './layouts/App';

axios.defaults.withCredentials = true;
axios.defaults.baseURL =
  process.env.NODE_ENV === 'production' ? 'https://blooways.com' : 'http://localhost:4080';

render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.querySelector('#app'),
);
