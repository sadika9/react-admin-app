import React, {Component} from 'react';
import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom';
import AuthScreen from 'screens/root/AuthScreen';
import PaperbaseScreen from 'screens/root/Paperbase';
import PageNotFound from 'components/PageNotFound';
import AuthService from 'services/AuthService';

import './App.css';

function PrivateRoute({ component: Component, ...rest }) {
  const isAuthenticated = AuthService.isAuthenticated();

  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/auth/sign_in",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
}

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/auth" component={AuthScreen} />
          <PrivateRoute path="/" component={PaperbaseScreen} />
          <Route component={PageNotFound} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
