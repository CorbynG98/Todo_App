import { CancelTokenSource } from 'axios';
import { ThunkAction } from 'redux-thunk';
import { Authenticate, Signout, Signup } from '../../apiclient/apiclient';
import { AuthResource } from '../../models/AuthResource';
import { State } from '../../models/State';
import {
  getCookie,
  removeCookie,
  setAuthCookie,
} from '../../storageclient/storageclient';

type appInitData = {
  username: string | null;
  token: string | null;
};

type signinData = {
  username: string;
  token: string;
};

type setActiveLink = {
  activeLink: string;
};

export type Action =
  | { type: 'SIGN_IN'; data: signinData }
  | { type: 'SIGN_OUT' }
  | { type: 'APP_INIT'; data: appInitData };

export const initBaseData =
  (): ThunkAction<void, State, unknown, Action> => async (dispatch) => {
    const authData = await getCookie('railsTodoData');
    dispatch({
      type: 'APP_INIT',
      data: { username: authData?.username, token: authData?.token },
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
      await setAuthCookie(result.username ?? '', result.session_token ?? '');
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
      await setAuthCookie(result.username ?? '', result.session_token ?? '');
      dispatch({
        type: 'SIGN_IN',
        data: {
          username: result.username ?? '',
          token: result.session_token ?? '',
        },
      });
    };

export const signOut =
  (
    cancelToken: CancelTokenSource | undefined | null = null,
  ): ThunkAction<void, State, unknown, Action> =>
    async (dispatch) => {
      let cookie = await getCookie('railsTodoData');
      if (cookie == null) return; // Don't logout if we aren't logged in?
      // Do some stuff here to revoke the access token api side
      Signout(cancelToken).then(() => {
        removeCookie('railsTodoData');
      }).catch(() => {
        removeCookie('railsTodoData');
        /* Ignoring this, signout not relevant for failure, just remove cookie anyway */
      });
      dispatch({ type: 'SIGN_OUT' });
    };
