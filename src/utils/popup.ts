import { assets } from '@assets';
import { _t } from '@i18n';
import { containerNav } from '@navigator/helper';
import { routes } from '@navigator/routes';
import {
  Alert,
  AlertButton,
  AlertOptions,
  AlertType,
  DeviceEventEmitter,
  KeyboardType,
  NativeModules,
  Platform,
} from 'react-native';
import { IOverlay } from 'screen-props';
import {
  ActionSheetIOS,
  ActionSheetIOSOptions as Option,
  ShareActionSheetIOSOptions as ShareOption,
} from 'react-native';
import ActionSheet from 'react-native-action-sheet';
import Toast from 'react-native-simple-toast';
import { PermissionsManager } from './permissions';
import ImageCropPicker, {
  Image,
  Options,
} from 'react-native-image-crop-picker';
import { ConsoleUtils } from './log';
import { StackActions } from '@react-navigation/native';
import { events } from '@values';

type Response =
  | { success: true; images: Image[] }
  | { success: false; error: string | Error };

type ResponseSingle =
  | { success: true; images: Image }
  | { success: false; error: string | Error };

const showOverlay = (params?: IOverlay) => {
  DeviceEventEmitter.emit(events.showOverlay);

  // NativeModules.Utils.showOverlay();
  // const currentRoute = containerNav.current?.getCurrentRoute();
  // if (currentRoute?.name !== routes._overlay) {
  //   containerNav.current?.dispatch(StackActions.push(routes._overlay, params));
  // }
};

const dismissOverlay = () => {
  // NativeModules.Utils.dismissOverlay();
  DeviceEventEmitter.emit(events.dismissOverlay);
  return;
  // containerNav.current?.canGoBack()
  //   ? containerNav.current?.goBack()
  //   : undefined;
};

const DURATION = {
  long: Toast.LONG,
  short: Toast.SHORT,
};

const GRAVITY = {
  top: Toast.TOP,
  center: Toast.CENTER,
  bottom: Toast.BOTTOM,
};

// const options: Options = {
//   writeTempFile: true,
//   mediaType: 'photo',
//   includeBase64: true,
//   compressImageQuality: 0.8,
//   width: 960,
//   height: 1280,
//   multiple,
// }

export class PopupPrototype {
  static showOverlay = () => showOverlay();
  static dismissOverlay = () => dismissOverlay();

  static showProtectedOverlay = () =>
    showOverlay({
      img: assets.icon.ic_shield,
      label: _t('protectTransaction'),
    });

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

  static showActionSheetWithOptions = (
    options: Option,
    callback: (buttonIndex: number) => void,
  ) => {
    const staticClass = Platform.OS === 'ios' ? ActionSheetIOS : ActionSheet;
    staticClass.showActionSheetWithOptions(options, callback);
  };

  private static showCameraSheet = (
    title = '',
    multiple = false,
  ): Promise<any> => {
    return new Promise((resolve) => {
      const callback = async (index: number) => {
        if (index > 1) {
          return resolve({ success: false, error: 'User cancelled' });
        }
        const isCamera = index === 0;
        const { PERMISSIONS, requestPermission } = PermissionsManager;
        const { CAMERA, PHOTO_LIBRARY } = PERMISSIONS;
        const permission = isCamera ? CAMERA : PHOTO_LIBRARY;
        let name = _t(isCamera ? 'cameraPermission' : 'libraryPermission');

        try {
          const isGranted = await requestPermission(permission, name);
          if (isGranted === 'granted') {
            const action = isCamera
              ? ImageCropPicker.openCamera
              : ImageCropPicker.openPicker;

            const options: Options = {
              writeTempFile: true,
              mediaType: 'photo',
              includeBase64: true,
              compressImageQuality: 0.8,
              width: 960,
              height: 1280,
              multiple,
            };

            const images = (await action(options)) as any;
            resolve({ success: true, images });
          } else {
            PopupPrototype.alert(
              _t('alert.alert'),
              _t('permissionUnavailable', {
                permission: name,
              }),
            );
            resolve({ success: false, error: `${permission} unavailable` });
          }
        } catch (error) {
          ConsoleUtils.le('ImagePicker error: ', error);
          resolve({ success: false, error });
        }
      };
      PopupPrototype.showActionSheetWithOptions(
        {
          title,
          options: [_t('capture'), _t('library'), _t('cancel')],
          cancelButtonIndex: 2,
        },
        callback,
      );
    });
  };

  static showCameraSheetMultiple = (title?: string): Promise<Response> =>
    PopupPrototype.showCameraSheet(title, true);

  static showCameraSheetSingle = (title?: string): Promise<ResponseSingle> =>
    PopupPrototype.showCameraSheet(title, false);

  static showShareActionSheetWithOptions = (
    options: ShareOption,
    failureCallback: (error: Error) => void,
    successCallback: (success: boolean, method: string) => void,
  ) => {
    const staticClass = Platform.OS === 'ios' ? ActionSheetIOS : ActionSheet;
    staticClass.showShareActionSheetWithOptions(
      options,
      failureCallback,
      successCallback,
    );
  };
  static showToast = (
    message: string,
    duration?: number | undefined,
    viewControllerBlacklist?: string[] | undefined,
  ) => Toast.show(message, duration, viewControllerBlacklist);

  static showToastWithGravity = (
    message: string,
    duration: keyof typeof DURATION,
    gravity: keyof typeof GRAVITY,
    viewControllerBlacklist?: string[] | undefined,
  ) =>
    Toast.showWithGravity(
      message,
      DURATION[duration],
      GRAVITY[gravity],
      viewControllerBlacklist,
    );
}
