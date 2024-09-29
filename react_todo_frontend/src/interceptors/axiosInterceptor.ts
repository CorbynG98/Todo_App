// src/interceptors/axiosInterceptor.ts

import axios from 'axios';
import { Notyf } from 'notyf';
import { signOut } from '../context/slices/auth_slice';
import { store } from '../context/store';
import { getCookie } from '../storageclient/storageclient';
import appSettings from './appsettings.json';

const createApiInterceptor = (apiUrl: string) => {
  const apiInstance = axios.create({
    baseURL: apiUrl,
  });

  const notyf = new Notyf({
    dismissible: true,
    position: { x: 'right', y: 'top' },
  });

  apiInstance.interceptors.request.use(async (config: any) => {
    let auth = await getCookie('authData');
    if (auth != null && auth.token != null) {
      config.headers.Authorization = `${auth.token}`;
    }
    return config;
  });

  apiInstance.interceptors.response.use(
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
          store.dispatch(signOut());
        }
        return Promise.reject(error || 'Something went wrong');
      }
    },
  );

  return apiInstance;
};

export default async function GetAxiosInstance() {
  const apiData = await getCookie('apiData');
  switch (apiData?.apiType) {
    case 'rails':
      return createApiInterceptor(appSettings.apiUrlRails);
    case 'node':
      return createApiInterceptor(appSettings.apiUrlNode);
    case 'rust':
      return createApiInterceptor(appSettings.apiUrlRust);
    case 'dotnet':
      return createApiInterceptor(appSettings.apiUrlDotnet);
    default:
      return createApiInterceptor(appSettings.apiUrlRust); // Default to Rust if no match
  }
}
