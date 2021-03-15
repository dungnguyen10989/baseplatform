import { createActions, createActionType } from '../helper';

const prefix = 'ORDER';

const types = {
  getList: createActionType('getList', prefix),
  updateStatus: createActionType('updateStatus', prefix),
};

const actions = {
  getList: createActions(types.getList),
  updateStatus: createActions(types.updateStatus),
};

export { types, actions };
