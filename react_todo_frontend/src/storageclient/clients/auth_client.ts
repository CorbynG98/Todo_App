import Cookies from 'universal-cookie';

export const setAuthDataCookie = (username: string, token: string) => {
  const cookies = new Cookies();
  cookies.set('authData', { username: username, token: token });
};

export const setApiDataCookie = (apiType: string) => {
  const cookies = new Cookies();
  cookies.set('apiData', { apiType: apiType });
};

export const getCookie = (cookieName: string) => {
  const cookies = new Cookies();
  return cookies.get(cookieName);
};

export const removeCookie = (cookieName: string) => {
  const cookies = new Cookies();
  cookies.remove(cookieName);
};
