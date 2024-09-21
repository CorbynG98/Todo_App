import { AnyAction } from '@reduxjs/toolkit';
import { State } from '../../models/State';

const initialState: State = {
  username: null,
  token: null,
  isLoggedIn: false,
  apiType: 'rails',
};

const auth_reducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case 'SIGN_IN':
      return {
        ...state,
        isLoggedIn: true,
        username: action.data.username,
        token: action.data.token,
      };
    case 'APP_INIT':
      return {
        ...state,
        isLoggedIn: action.data.username == null ? false : true,
        username: action.data.username,
        token: action.data.token,
        apiType: action.data.apiType,
      };
    case 'SIGN_OUT':
      return {
        ...state,
        isLoggedIn: false,
        username: null,
        token: null,
      };
    case 'CHANGE_API_TYPE':
      return {
        ...state,
        apiType: action.data.apiType,
        isLoggedIn: state.username == null ? false : true,
      };
    default:
      return state;
  }
};
export default auth_reducer;
