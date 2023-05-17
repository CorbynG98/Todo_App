import { AnyAction, configureStore, Store } from '@reduxjs/toolkit';
import { Dispatch } from 'react';
import { State } from '../models/State';
import auth_reducer from './reducers/auth_reducer';

const store: Store<State, any> & { dispatch: Dispatch<AnyAction> } =
  configureStore({
    reducer: auth_reducer,
  });

export { store };
