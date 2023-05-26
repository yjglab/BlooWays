import NavBar from '@components/NavBar';
import loadable from '@loadable/component';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const Blooway = loadable(() => import('@layouts/Blooway'));
const SignUp = loadable(() => import('@pages/SignUp'));
const SignIn = loadable(() => import('@pages/SignIn'));

const App = () => (
  <div className='h-screen'>
    <NavBar />
    <Switch>
      <Route exact path='/'>
        <Redirect to='/signin' />
      </Route>
      <Route path='/signup' component={SignUp} />
      <Route path='/signin' component={SignIn} />
      <Route path='/blooway/:blooway' component={Blooway} />
    </Switch>
  </div>
);

export default App;
