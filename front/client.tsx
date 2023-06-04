import axios from 'axios';
import 'core-js/stable';
import './styles/globals.css';
import React from 'react';
import App from './layouts/App';
import { BrowserRouter } from 'react-router-dom';
import { render } from 'react-dom';

axios.defaults.withCredentials = true;
axios.defaults.baseURL =
  process.env.NODE_ENV === 'production' ? 'https://blooway.web.app' : 'http://localhost:4090';

render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.querySelector('#app'),
);
