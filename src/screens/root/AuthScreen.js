import React from 'react';
import {Switch, Route} from 'react-router-dom';
import PageNotFound from 'components/PageNotFound';
import SignInScreen from 'screens/Auth/SignInScreen';

function AuthScreen() {
  return (
    <Switch>
      <Route path="/auth/sign_in" component={SignInScreen}/>
      <Route component={PageNotFound}/>
    </Switch>
  );
}

export default AuthScreen;
