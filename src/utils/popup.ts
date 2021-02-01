import { assets } from '@assets';
import { _t } from '@i18n';
import { containerNav } from '@navigator/helper';
import { ROUTES } from '@navigator/routes';
import {
  Alert,
  AlertButton,
  AlertOptions,
  AlertType,
  KeyboardType,
} from 'react-native';
import { IOverlay } from 'screen-props';

const showOverlay = (params?: IOverlay) => {
  const currentRoute = containerNav.current?.getCurrentRoute();
  if (currentRoute?.name !== ROUTES._overlay) {
    containerNav.current?.navigate(ROUTES._overlay, params);
  }
};

const dismissOverlay = () => {
  containerNav.current?.canGoBack()
    ? containerNav.current?.goBack()
    : undefined;
};

export class PopupManager {
  static showOverlay = () => showOverlay();

  static showProtectedOverlay = () =>
    showOverlay({
      img: assets.icon.ic_shield,
      label: _t('protectTransaction'),
    });

  static dismissOverlay = () => dismissOverlay();

  static alert = (
    title: string,
    message?: string,
    buttons?: AlertButton[],
    options?: AlertOptions,
  ) => Alert.alert(title, message, buttons, options);

  static prompt = (
    title: string,
    message?: string,
    callbackOrButtons?: ((text: string) => void) | AlertButton[],
    type?: AlertType,
    defaultValue?: string,
    keyboardType?: KeyboardType,
  ) =>
    Alert.prompt(
      title,
      message,
      callbackOrButtons,
      type,
      defaultValue,
      keyboardType,
    );
}
