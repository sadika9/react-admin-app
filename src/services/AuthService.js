import * as moment from 'moment';
import HttpService from './HttpService';

class AuthService {

  static signIn(username, password) {
    const data = {username, password};

    // AUTH BY-PASS
    return new Promise(function(resolve, reject) {
        const responseData = {
          access_token: 'ABC',
          expires_at: '2020-04-28T13:36:15+05:30',
          refresh_token: 'DEF'
        };
        AuthService.setSession(responseData);

        resolve(true);
    });

/*    return HttpService.http().post('api:v1:guest://auth/authenticate', data)
    .then(response => {
        AuthService.setSession(response.data);
      return response;
    });*/
  }

  static signOut() {
    return HttpService.http().post('api:v1://auth/logout', {})
      .finally(() => {
        AuthService.clearSession();
      });
  }

  static isAuthenticated() {
    return localStorage.getItem('access_token') != null;
  }

  static getTokenExpiration() {
    const expiresAt = localStorage.getItem('expires_at');

    if (expiresAt == null) {
      return null;
    }

    return moment(expiresAt);
  }

  static setSession(accessToken) {
    localStorage.setItem('access_token', accessToken.access_token);
    localStorage.setItem('expires_at', accessToken.expires_at);
    localStorage.setItem('refresh_token', accessToken.refresh_token);
  }

  static clearSession() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('refresh_token');
  }
}

export default AuthService;
