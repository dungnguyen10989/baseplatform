import { Linking } from 'react-native';
import { PopupPrototype } from './popup';
import { StringPrototype } from './prototype';
import { _t } from '@i18n';
import { constants } from '@values';
import { ConsoleUtils } from './log';

const makeCall = async (phone: string) => {
  const phoneWithoutSpaces = StringPrototype.removeAllSpaces(phone);
  const url = `tel:${phoneWithoutSpaces}`;
  Linking.openURL(url).catch((error) => {
    ConsoleUtils.le('makeCall error', error);
    PopupPrototype.alert(_t('failure'), _t('cannotMakeCall', { phone }));
  });
};

const mailTo = async (email: string) => {
  const url = `mailto:${email}`;
  Linking.openURL(url).catch((error) => {
    ConsoleUtils.le('mailTo error', error);
    PopupPrototype.alert(_t('failure'), _t('cannotMailToCall', { email }));
  });
};

const openUrl = async (url: string) => {
  Linking.openURL(url).catch((error) => {
    ConsoleUtils.le('openUrl error', error);
    PopupPrototype.alert(
      _t('failure'),
      _t('cannotOpenURL', {
        url: StringPrototype.cutLongString(url, 20),
      }),
    );
  });
};

const directToLocation = (lat: number, lng: number, name = '') => {
  const scheme = constants.isIos ? 'maps:0,0?q=' : 'geo:0,0?q=';
  const latLng = `${lat},${lng}`;
  const _url = constants.isIos
    ? `${scheme}${name}@${latLng}`
    : `${scheme}${latLng}(${name})`;

  openUrl(_url);
};

export const DeviceManager = {
  makeCall,
  openUrl,
  mailTo,
  directToLocation,
};
