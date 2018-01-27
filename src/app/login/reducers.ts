import { handleActions, Action } from 'redux-actions';
import { combineEpics, Epic } from 'redux-observable';
import { IRootState } from 'app';
import { Observable } from 'rxjs';

import * as c from './constants';
import * as actions from './actions';
import { verifyLogin } from './services';

export type ILoginStatus = 'success' | 'pristine' | 'checking' | 'failure';

export interface IReducerState {
  id: string;
  password: string;
  status: ILoginStatus;
}

const INITIAL_STATE: IReducerState = {
  id: '',
  password: '',
  status: 'pristine'
};

export default handleActions<IReducerState, never>(
  {
    [c.LOGIN_EDIT_FIELD]: (
      state,
      action: Action<actions.IEditFieldPayload>
    ) => {
      const payload = action.payload as actions.IEditFieldPayload;

      const newState = {
        ...state,
        [payload.key]: payload.value
      };

      if (state.status !== 'pristine') {
        Object.assign(newState, { status: 'pristine' });
      }

      return newState;
    },
    [c.UPDATE_LOGIN_STATUS]: (state, action: Action<ILoginStatus>) => ({
      ...state,
      status: action.payload as ILoginStatus
    })
  },
  INITIAL_STATE
);

const checkCredentialsEpic: Epic<Action<any>, IRootState> = (action$, store) =>
  action$.ofType(c.CHECK_CREDENTIALS).mergeMap(() => {
    const loginState = store.getState().login;

    return Observable.concat(
      Observable.of(actions.updateLoginStatus('checking')),
      verifyLogin(loginState).mergeMap(isLogin =>
        Observable.of(
          actions.updateLoginStatus(isLogin ? 'success' : 'failure')
        )
      )
    );
  });

export const epics = combineEpics(checkCredentialsEpic);