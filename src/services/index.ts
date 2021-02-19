import { create, ApisauceConfig, ApiResponse } from 'apisauce';
import { getOr } from 'lodash/fp';
import { ConsoleUtils, PopupPrototype } from '@utils';
import i18n from 'i18n-js';
import { configs, constants } from '@values';
import { Keyboard } from 'react-native';
import { mConfigSchema } from '@database/schemas';
import { Database } from '@nozbe/watermelondb';
import { containerNav } from '@navigator/helper';
import { StackActions } from '@react-navigation/native';
import { routes } from '@navigator/routes';
import database from '@database';

type Method =
  | 'get'
  | 'post'
  | 'delete'
  | 'patch'
  | 'put'
  | 'link'
  | 'unlink'
  | 'head';

const apisauceInstance = create({
  baseURL: 'https://admin-shop.babaza.vn/api/v1/',
  timeout: 60000,
});

export type HttpResponse = {
  success: boolean;
  data?: any;
  error?: any;
};

const fetchAPI = async function <T>(
  path: string,
  method: Method,
  _params?: any,
  config?: ApisauceConfig | undefined,
): Promise<HttpResponse> {
  const func: <T = any, U = T>(
    path: string,
    params?: object,
    axiosConfig?: ApisauceConfig,
  ) => Promise<ApiResponse<T, U>> = apisauceInstance[method];

  return new Promise((resolve) => {
    const params =
      method === 'get'
        ? Object.assign({}, _params, {
            pageSize: constants.pageSize,
            page: _params?.page || 1,
          })
        : _params;
    if (!params?.ignoreDismissKeyboard) {
      Keyboard.dismiss();
    }
    func(path, params, config)
      .then((res: ApiResponse<any>) => {
        ConsoleUtils.l(':::API RESPONSE:::', res);
        if (res.status === 200 && res.data?.success) {
          delete res.data.success;
          resolve({ success: true, data: res.data });
        } else {
          resolve({ success: false, error: res.data });
        }
      })
      .catch((error: Error) => {
        ConsoleUtils.le(':::API RESPONSE:::', error);
        resolve({ success: false, error });
      });
  });
};

const getMessageError = (error: any) => {
  const status: any = getOr(undefined, 'status', error);
  const problem: any = getOr(undefined, 'problem', error);

  const localize = i18n.t('error') as any;
  return localize[status] || localize[problem] || localize.defaultError;
};

const handleApiError = (error: any, callback?: () => void) => {
  const status: any = getOr(undefined, 'status', error);
  const problem: any = getOr(undefined, 'problem', error);

  if (!status && !problem) {
    return;
  }

  const message = i18n.t('error')[problem] || i18n.t('error')[status];

  if (!message) {
    return;
  }

  PopupPrototype.alert(i18n.t('alert.error'), message, [
    {
      text: i18n.t('ok'),
      onPress: callback,
    },
  ]);
};

export const silentFetch = async (callback = () => {}) => {
  const values = await Promise.all([
    fetchAPI('get/auth/app/unit', 'get'),
    fetchAPI('get/auth/app/shop/branch', 'get'),
    fetchAPI('get/auth/app/shop/qrcode', 'get'),
  ]);
  const unit = values[0].data;
  const branch = values[1].data;
  const qr = values[2].data;
  const jobs = [];

  if (unit) {
    jobs.push({ name: configs.unit, value: unit.units });
  }
  if (branch) {
    jobs.push({ name: configs.branch, value: branch.branch });
  }
  if (qr) {
    jobs.push({ name: configs.qr, value: qr.qrcode });
  }

  mConfigSchema.addOrUpdateMulti(database, jobs);
  callback();
};

const setHttpAuthorizationToken = (token: string) =>
  apisauceInstance.setHeader('Authorization', `Bearer ${token}`);

const deleteHttpAuthorizationToken = () =>
  apisauceInstance.deleteHeader('Authorization');

const updateLocalAuth = (db: Database, user: any) => {
  setHttpAuthorizationToken(user.token);
  mConfigSchema.addOrUpdateConfig(db, configs.user, user);
  containerNav.current?.dispatch(StackActions.replace(routes._rootTabs));
  silentFetch();
};

const clearUserInfo = (db: Database) => {
  deleteHttpAuthorizationToken();
  mConfigSchema.deleteConfig(db, configs.user);
};

export {
  apisauceInstance,
  fetchAPI,
  getMessageError,
  handleApiError,
  deleteHttpAuthorizationToken,
  setHttpAuthorizationToken,
  clearUserInfo,
  updateLocalAuth,
};
