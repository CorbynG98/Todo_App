import { CancelTokenSource } from 'axios';
import { ThunkAction } from 'redux-thunk';
import { Authenticate, Signout, Signup } from '../../apiclient/apiclient';
import { AuthResource } from '../../models/AuthResource';
import { State } from '../../models/State';
import {
  getCookie,
  removeCookie,
  setApiDataCookie,
  setAuthDataCookie,
} from '../../storageclient/storageclient';

type appInitData = {
  username: string | null;
  token: string | null;
  apiType: string | null;
  cookieName: string | null;
};

type apiTypeChangeData = {
  apiType: string | null;
  cookieName: string | null;
  username: string | null;
  token: string | null;
};

type signinData = {
  username: string;
  token: string;
};

export type Action =
  | { type: 'SIGN_IN'; data: signinData }
  | { type: 'SIGN_OUT' }
  | { type: 'APP_INIT'; data: appInitData }
  | { type: 'CHANGE_API_TYPE'; data: apiTypeChangeData };

export const initBaseData =
  (): ThunkAction<void, State, unknown, Action> => async (dispatch) => {
    const apiData = await getCookie('apiData');
    const authData = await getCookie(apiData?.cookieName ?? 'railsAuthData');
    dispatch({
      type: 'APP_INIT',
      data: { username: authData?.username, token: authData?.token, apiType: apiData?.apiType, cookieName: apiData?.cookieName },
    });
  };

export const signIn =
  (
    loginData: AuthResource,
    cancelToken: CancelTokenSource | undefined | null = null,
  ): ThunkAction<void, State, unknown, Action> =>
    async (dispatch) => {
      // Do some other stuff here to actually call API to login
      var result = await Authenticate(loginData, cancelToken);
      const apiData = await getCookie('apiData');
      await setAuthDataCookie(result.username ?? '', result.session_token ?? '', apiData?.cookieName ?? 'railsAuthData');
      dispatch({
        type: 'SIGN_IN',
        data: {
          username: result.username ?? '',
          token: result.session_token ?? '',
        },
      });
    };

export const signUp =
  (
    loginData: AuthResource,
    cancelToken: CancelTokenSource | undefined | null = null,
  ): ThunkAction<void, State, unknown, Action> =>
    async (dispatch) => {
      // Do some other stuff here to actually call API to login
      var result = await Signup(loginData, cancelToken);
      const apiData = await getCookie('apiData');
      await setAuthDataCookie(result.username ?? '', result.session_token ?? '', apiData?.cookieName ?? 'railsAuthData');
      dispatch({
        type: 'SIGN_IN',
        data: {
          username: result.username ?? '',
          token: result.session_token ?? '',
        },
      });
    };

export const changeApiType = (newApiType: string): ThunkAction<void, State, unknown, Action> =>
  async (dispatch) => {
    // Do some other stuff here to actually call API to login
    var data = { apiType: newApiType, cookieName: `${newApiType}AuthData` }
    var authData = await getCookie(data.cookieName);
    await setApiDataCookie(data.apiType, data.cookieName);
    dispatch({
      type: 'CHANGE_API_TYPE',
      data: { ...data, username: authData?.username, token: authData?.token },
    });
  };

export const signOut =
  (
    cancelToken: CancelTokenSource | undefined | null = null,
  ): ThunkAction<void, State, unknown, Action> =>
    async (dispatch) => {
      const apiData = await getCookie('apiData');
      let cookie = await getCookie(apiData?.cookieName ?? 'railsAuthData');
      if (cookie == null) return; // Don't logout if we aren't logged in?
      // Do some stuff here to revoke the access token api side
      Signout(cancelToken).then(() => {
        removeCookie(apiData?.cookieName ?? 'railsAuthData');
      }).catch(() => {
        removeCookie(apiData?.cookieName ?? 'railsAuthData');
        /* Ignoring this, signout not relevant for failure, just remove cookie anyway */
      });
      dispatch({ type: 'SIGN_OUT' });
    };
