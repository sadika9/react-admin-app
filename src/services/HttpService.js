import axios from 'axios';
import AuthService from './AuthService';

/**
 * Refresh token logic based on following
 * 1. https://gist.github.com/FilipBartos/c2cc4df3dfda49f71360295e4101db2b
 * 2. https://gist.github.com/mkjiau/650013a99c341c9f23ca00ccb213db1c
 */
class HttpService {

  static instance = null;
  static refreshTokenInProgress = false;

  static http() {
    if (HttpService.instance === null) {
      HttpService.instance = HttpService.createInstance();
    }

    return HttpService.instance;
  }

  static getBaseUrl() {
    let url = process.env.REACT_APP_API_BASE_URL;

    if (url !== '__DYNAMIC__') {
      return url;
    }

    const host = window.location.host;
    const urlRegEx = /^(.+)\.app\.(dev|qa|uat)\\.example\.com$/;

    if (host === 'example.com') {
      url = 'https://api.example.com';
    } else if (urlRegEx.test(host)) {
      const match = host.match(urlRegEx);
      url = `http://${match[1]}.api.${match[2]}.example.com`;
    } else {
        throw new Error('Unknown host');
    }

    return url;
  }

  static createInstance() {
    const config = {
      baseURL: HttpService.getBaseUrl(),
    };

    const instance = axios.create(config);

    // URL placeholder replacer
    instance.interceptors.request.use(function (config) {
      if (!config.url.startsWith('api:v1:')) {
        return config;
      }
      // Keep original API request URL
      // This will use to detect API request is public or private
      config['apiUrl'] = config.url;

      const regex = /^api:v1:(guest:)?\/\//;
      // Set base api URL to all URLs starts with "api:v1:guest://" and "api:v1://"
      config.url = config.url.replace(regex, '/v1/admin/');

      return config;
    });

    // Interceptor to add authorization header
    instance.interceptors.request.use(async function (config) {
      if (!config.url.startsWith('api:v1://')) {
        return config;
      }

      // if refresh token is in progress wait until it completes
      if (HttpService.refreshTokenInProgress) {
        await until(_ => HttpService.refreshTokenInProgress === false);
      }

      const token = localStorage.getItem('access_token');
      config.headers['Authorization'] = `Bearer ${token}`;

      return config;
    });

    instance.interceptors.response.use(function (response) {
      return response;
    }, async function (error) {
      const { config, response: { status } } = error;
      const originalRequest = config;

      if (status !== 401) {
        return Promise.reject(error);
      }

      // If we have a refresh token try to get new access tokens using it
      if (localStorage.getItem('refresh_token') !== null) {
        HttpService.refreshTokenInProgress = true;

        try {
          await refreshAccessToken();
        } catch (e) {
          AuthService.clearSession();
          window.location.href = '/auth/sign_in';

          return Promise.reject(e);
        }

        HttpService.refreshTokenInProgress = false;

        // as current request failed, retry with newly obtained access tokens
        const retryOriginalRequest = new Promise((resolve) => {
          const token = localStorage.getItem('access_token');
          originalRequest.headers.Authorization = `Bearer ${token}`;

          resolve(instance(originalRequest));
        });

        return retryOriginalRequest;
      }

      if (config.apiUrl && config.apiUrl.startsWith('api:v1://')) {
        AuthService.clearSession();
        window.location.href = '/auth/sign_in';
      }

      return Promise.reject(error);
    });

    return instance;
  }
}

function refreshAccessToken() {
  const http = axios.create({
    baseURL: HttpService.getBaseUrl(),
  });

  const body = {
    'refresh_token': localStorage.getItem('refresh_token')
  };

  return http.post('v1/admin/auth/refresh_access_token', body)
    .then(response => {
      AuthService.setSession(response.data);

      return response;
    });
}

/**
 * Based on https://stackoverflow.com/a/52657929
 * @param conditionFunction
 * @returns {Promise<any>}
 */
function until(conditionFunction) {
  const poll = resolve => {
    if (conditionFunction()) {
      resolve();
    } else {
      setTimeout(_ => poll(resolve), 100);
    }
  };

  return new Promise(poll);
}

export default HttpService;
