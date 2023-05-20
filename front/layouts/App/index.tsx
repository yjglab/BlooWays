import loadable from '@loadable/component';
import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

const Blooway = loadable(() => import('@layouts/Blooway'));
const SignUp = loadable(() => import('@pages/SignUp'));
const SignIn = loadable(() => import('@pages/SignIn'));

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<Navigate replace to='/signin' />} />
      <Route path='/signup' element={<SignUp />} />
      <Route path='/signin' element={<SignIn />} />
      <Route path='/blooway/:blooway' element={<Blooway />} />
    </Routes>
  </BrowserRouter>
);

export default App;
