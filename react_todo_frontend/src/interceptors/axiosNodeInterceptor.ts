import axios from 'axios';
import { Notyf } from 'notyf';
import { signOut } from '../context/slices/auth_slice';
import { store } from '../context/store';
import { getCookie } from '../storageclient/storageclient';
import appSettings from './appsettings.json';

const axiosNodeInstance = axios.create({
  baseURL: appSettings.apiUrlNode,
});

const notyf = new Notyf({
  dismissible: true,
  position: { x: 'right', y: 'top' },
});

axiosNodeInstance.interceptors.request.use(async (config: any) => {
  // Get data from async storage for processing reasons
  let auth = await getCookie('nodeAuthData');
  if (auth != null && auth.token != null) {
    config.headers.Authorization = `${auth.token}`;
  }
  return config;
});

axiosNodeInstance.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
    if (axios.isCancel(error)) return Promise.reject('Cancelled request');
    else {
      if (error.response == null) {
        notyf.error('Network error. Try again later!');
        return Promise.reject('Network error');
      }
      if (error.response.status === 401 || error.response.status === 403) {
        notyf.error('Authentication error.');
        store.dispatch(signOut()); // Rejection handled on next in few lines anyways. No need to reject here too.
      }
      return Promise.reject(error || 'Something went wrong');
    }
  },
);

export default axiosNodeInstance;
