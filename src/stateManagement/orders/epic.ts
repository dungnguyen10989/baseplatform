import { of, from } from 'rxjs';
import { ActionsObservable, ofType, combineEpics } from 'redux-observable';
import { catchError, switchMap, takeUntil } from 'rxjs/operators';
import { IAction } from 'local-redux';
import { types, actions } from './action';
import { fetchAPI } from '@services';
import { PopupPrototype } from '@utils';

const getListEpic = (action$: ActionsObservable<IAction>) => {
  return action$.pipe(
    ofType(types.getList.start),
    switchMap((action) => {
      const { payload, onSuccess, onError } = action;
      return from(fetchAPI('get/auth/app/shop/orders', 'get', payload)).pipe(
        switchMap((response) => {
          const { data, error } = response;
          if (error) {
            throw error;
          }
          onSuccess(data);
          return of(actions.getList.success({ ...payload, ...data }));
        }),
        takeUntil(action$.pipe(ofType(types.getList.cancel))),
        catchError((error) => {
          onError(error);
          return of(actions.getList.error(error));
        }),
      );
    }),
  );
};

const updateStatusEpic = (action$: ActionsObservable<IAction>) => {
  return action$.pipe(
    ofType(types.updateStatus.start),
    switchMap((action) => {
      const { payload, onSuccess, onError } = action;
      PopupPrototype.showOverlay();
      return from(
        fetchAPI('set/app/update/status/order', 'post', payload),
      ).pipe(
        switchMap((response) => {
          PopupPrototype.dismissOverlay();
          const { data, error } = response;
          if (error) {
            throw error;
          }
          onSuccess(data);
          return of(actions.updateStatus.success(data));
        }),
        takeUntil(action$.pipe(ofType(types.updateStatus.cancel))),
        catchError((error) => {
          PopupPrototype.dismissOverlay();
          onError(error);
          return of(actions.updateStatus.error(error));
        }),
      );
    }),
  );
};

export default combineEpics(getListEpic, updateStatusEpic);
