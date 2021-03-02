import { of, from } from 'rxjs';
import { ActionsObservable, ofType, combineEpics } from 'redux-observable';
import { catchError, switchMap, takeUntil } from 'rxjs/operators';
import { IAction } from 'local-redux';
import { types, actions } from './action';
import { fetchAPI } from '@services';
import { PopupPrototype } from '@utils';
import { valuesActions } from '@state/values';

const loginEpic = (action$: ActionsObservable<IAction>) => {
  return action$.pipe(
    ofType(types.login.start),
    switchMap((action) => {
      const { payload, onSuccess, onError } = action;
      const { username, password } = payload;
      return from(fetchAPI('auth/login', 'post', { username, password })).pipe(
        switchMap((response) => {
          const { data, error } = response;
          if (error) {
            throw error;
          }
          onSuccess(data);
          return of(
            valuesActions.silentFetch.start(),
            actions.login.success(data),
          );
        }),
        takeUntil(action$.pipe(ofType(types.login.cancel))),
        catchError((error) => {
          onError(error);
          return of(actions.login.error(error));
        }),
      );
    }),
  );
};

const getInfoEpic = (action$: ActionsObservable<IAction>) => {
  return action$.pipe(
    ofType(types.getInfo.start),
    switchMap((action) => {
      const { onSuccess, onError } = action;
      PopupPrototype.showOverlay();
      return from(fetchAPI('get/auth/app/userinfo', 'get')).pipe(
        switchMap((response) => {
          PopupPrototype.dismissOverlay();
          const { data, error } = response;
          if (error) {
            throw error;
          }
          onSuccess(data);
          return of(
            valuesActions.silentFetch.start(),
            actions.getInfo.success(data),
          );
        }),
        takeUntil(action$.pipe(ofType(types.getInfo.cancel))),
        catchError((error) => {
          PopupPrototype.dismissOverlay();
          onError(error);
          return of(actions.getInfo.error(error));
        }),
      );
    }),
  );
};

export default combineEpics(loginEpic, getInfoEpic);
