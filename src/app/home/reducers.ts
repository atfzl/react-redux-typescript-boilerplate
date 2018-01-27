import { handleActions, Action } from 'redux-actions';
import { combineEpics, Epic } from 'redux-observable';
import { Observable } from 'rxjs/Observable';
import { routerActions } from 'react-router-redux';

import { IRootState } from 'app';

import * as c from './constants';

export interface IReducerState {}

const INITIAL_STATE: IReducerState = {};

export default handleActions<IReducerState, never>({}, INITIAL_STATE);

const checkLoginEpic: Epic<Action<any>, IRootState> = (action$, store) =>
  action$.ofType(c.HOME_CHECK_LOGIN).mergeMap(() => {
    const loginState = store.getState().login;

    if (loginState.status !== 'success') {
      return Observable.of(routerActions.push('/login'));
    }

    return Observable.empty<never>();
  });

export const epics = combineEpics(checkLoginEpic);