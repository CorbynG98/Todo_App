import { getCookie } from '@src/storageclient/storageclient';
import axiosNodeInstance from './axiosNodeInterceptor';
import axiosRailsInstance from './axiosRailsInterceptor';

export default async function GetAxiosInstance() {
  const apiData = await getCookie('apiData');
  switch (apiData?.apiType) {
    case 'rails':
      return axiosRailsInstance;
    case 'node':
      return axiosNodeInstance;
    default:
      return axiosRailsInstance;
  }
}
