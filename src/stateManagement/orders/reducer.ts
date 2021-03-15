import { ArrayPrototype } from '@utils';
import { IAction } from 'local-redux';
import Immutable from 'seamless-immutable';
import { types } from './action';

interface State {
  data: Array<any>;
  error?: any;
}

const initialState = Immutable<State>({
  data: [],
  error: undefined,
});

export default (state = initialState, action: IAction) => {
  const { type, payload = {} } = action;
  const { page, orders } = payload;

  switch (type) {
    case types.getList.success:
      return state.merge({
        data:
          !page || page === 1
            ? orders
            : ArrayPrototype.standardizedByUnique(
                state.data.asMutable().concat(orders),
              ),
        error: undefined,
      });
    case types.getList.error:
      return state.merge({ data: [], error: payload });

    case types.updateStatus.success:
      return state.merge({
        data: state.data.map((i) => {
          if (i.order_id === orders.order_id) {
            return orders;
          }
          return i;
        }),
      });
    default:
      return state;
  }
};
