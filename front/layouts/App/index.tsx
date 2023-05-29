import NavBar from '@components/NavBar';
import loadable from '@loadable/component';
import React from 'react';
import { Route, Switch } from 'react-router-dom';

const Blooway = loadable(() => import('@layouts/Blooway'));
const Home = loadable(() => import('@pages/Home'));
const SignUp = loadable(() => import('@pages/SignUp'));
const SignIn = loadable(() => import('@pages/SignIn'));

const App = () => (
  <div>
    <NavBar />
    <Switch>
      <Route exact path='/' component={Home} />
      <Route path='/signup' component={SignUp} />
      <Route path='/signin' component={SignIn} />
      <Route path='/blooway/:blooway' component={Blooway} />
    </Switch>
  </div>
);

export default App;
