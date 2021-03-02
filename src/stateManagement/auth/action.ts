import { createActions, createActionType } from '../helper';

const prefix = 'AUTH';

const types = {
  login: createActionType('login', prefix),
  getInfo: createActionType('getInfo', prefix),
};

const actions = {
  login: createActions(types.login),
  getInfo: createActions(types.getInfo),
};

export { types, actions };
