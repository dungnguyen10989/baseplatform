import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import DatabaseProvider from '@nozbe/watermelondb/DatabaseProvider';
import messaging from '@react-native-firebase/messaging';
import database from './src/database';
import MainStackScreen from './src/navigator';
import { ConsoleUtils } from '@utils/log';
import codePush, { CodePushOptions } from 'react-native-code-push';
import { _t } from '@i18n';
import TextInputMask from 'react-native-text-input-mask';
import {
  AppState,
  AppStateStatus,
  DeviceEventEmitter,
  Linking,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { assets } from '@assets';
import { colors, constants, events, variants } from '@values';
import LottieView from 'lottie-react-native';
import { PopupPrototype, StringPrototype } from '@utils';
import { UIKit } from '@components/uikit';
import store from '@state/';
import { orderActions } from '@state/orders';

const { SyncStatus } = codePush;

const valid = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

function numberWithCommas(x: string) {
  if (!valid.includes(x[0])) {
    return '';
  }
  const reverse = StringPrototype.replaceAll(x, ',', '');
  return reverse.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

const Popup = memo(
  (props: {
    notify: any;
    onCancelPopup: () => void;
    onUpdatePopup: (noti: any, amount: string) => void;
  }) => {
    const { notify, onCancelPopup, onUpdatePopup } = props;
    const [amount, setAmount] = useState('');

    const onAmountChanged = useCallback((_amount: string) => {
      setAmount(numberWithCommas(_amount));
    }, []);

    return (
      <View style={styles.popupContent}>
        <UIKit.Text style={styles.popupTitle}>
          {_t('paymentRecordTitle')}
        </UIKit.Text>
        <View style={styles.popupForm}>
          <UIKit.Text style={styles.popupText}>
            {_t('customerName')}: {notify?.fullname}
          </UIKit.Text>
          <UIKit.Text style={styles.popupText}>
            {_t('customerPhone')}: {notify?.phone}
          </UIKit.Text>
          <UIKit.Text style={styles.popupText}>
            {_t('totalAmountPayment')}
          </UIKit.Text>
          <TextInputMask
            keyboardType="numeric"
            style={styles.popupInput}
            value={amount}
            onChangeText={onAmountChanged}
            mask="[9999].[99] đ"
          />
        </View>
        <UIKit.View style={styles.popupButtons}>
          <UIKit.Button
            style={styles.popupButton}
            title={_t('cancel')}
            bg={colors.black3}
            onPress={onCancelPopup}
          />
          <UIKit.Button
            style={styles.popupButton}
            title={_t('update')}
            disabledBg={colors.black3}
            onPress={onUpdatePopup.bind(null, notify, amount)}
            disabled={!amount}
          />
        </UIKit.View>
      </View>
    );
  },
);

const App = () => {
  const [display, setDisplay] = useState(0);
  const [notifies, setNotifies] = useState<Array<any>>([
    {
      fullname: 'test 1',
      phone: 'phone1',
      order_id: 1,
    },
    {
      fullname: 'test 2',
      phone: 'phone2',
      order_id: 2,
    },
  ]);

  const appState = useRef(AppState.currentState);

  const _handleShowOverlay = useCallback(() => setDisplay(display + 1), [
    display,
  ]);
  const _handleDismissOverlay = useCallback(() => {
    const newDisplay = Math.max(display - 1, 0);
    setDisplay(newDisplay);
  }, [display]);

  const onCancelPopup = useCallback(
    (notify: any) => {
      setNotifies(notifies.filter((i) => i.order_id !== notify.order_id));
    },
    [notifies],
  );

  const onUpdatePopup = useCallback(
    (notify: any, amount: string) => {
      store.dispatch(
        orderActions.updateStatus.start(
          {
            order_id: notify?.order_id,
            total_amount: amount,
          },
          () => PopupPrototype.alert(_t('success'), _t('updateOrderSuccess')),
          () => PopupPrototype.alert(_t('failure'), _t('updateOrderFail')),
        ),
      );
      onCancelPopup(notify);
    },
    [onCancelPopup],
  );

  const _handleOnNotify = useCallback(
    (remoteMessage: any, state: string) => {
      ConsoleUtils.l('Handle notify from state: ' + state, remoteMessage);
      if (remoteMessage?.data) {
        notifies.push(remoteMessage.data);
      }
    },
    [notifies],
  );

  useEffect(() => {
    ConsoleUtils.l('[START APP] db', database);

    AppState.addEventListener('change', _handleAppStateChange);
    const showSub = DeviceEventEmitter.addListener(
      events.showOverlay,
      _handleShowOverlay,
    );
    const dismissSub = DeviceEventEmitter.addListener(
      events.dismissOverlay,
      _handleDismissOverlay,
    );

    messaging()
      .requestPermission()
      .then((authStatus) => {
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (!enabled) {
          PopupPrototype.alert(
            _t('requestNotiTitle'),
            _t('requestNotiMessage'),
            [
              {
                text: _t('ok'),
                onPress: () => Linking.openURL('app-settings://'),
              },
              {
                text: _t('reject'),
              },
            ],
          );
        } else {
          messaging()
            .getToken()
            .then((token) => {
              ConsoleUtils.l('FirebaseToken: ' + token);
            });
        }
      });

    messaging().onMessage((remoteMessage) => {
      ConsoleUtils.l('A new FCM message arrived!', remoteMessage);
      _handleOnNotify(remoteMessage, 'FOREGROUND');
    });

    messaging().onNotificationOpenedApp((remoteMessage) => {
      _handleOnNotify(remoteMessage, 'BACKGROUND');

      ConsoleUtils.l(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        _handleOnNotify(remoteMessage, 'TERMINATED');

        if (remoteMessage) {
          ConsoleUtils.l(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
        }
      });

    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
      showSub.remove();
      dismissSub.remove();
    };
  }, [_handleShowOverlay, _handleDismissOverlay, _handleOnNotify]);

  const _handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      const codePushOptions: CodePushOptions = {
        checkFrequency: codePush.CheckFrequency.ON_APP_START,
        installMode: codePush.InstallMode.IMMEDIATE,
        mandatoryInstallMode: codePush.InstallMode.IMMEDIATE,
        updateDialog: {
          title: _t('updateVerTitle'),
          appendReleaseDescription: true,
          mandatoryContinueButtonLabel: _t('updateNow'),
          optionalIgnoreButtonLabel: _t('cancel'),
          optionalInstallButtonLabel: _t('updateNow'),
          optionalUpdateMessage: '',
          mandatoryUpdateMessage: '',
          descriptionPrefix: '',
        },
      };
      codePush.sync(
        codePushOptions,
        (status) => {
          switch (status) {
            case SyncStatus.CHECKING_FOR_UPDATE:
              // PopupManager.showLoading();
              break;
            case SyncStatus.UNKNOWN_ERROR:
            case SyncStatus.UPDATE_IGNORED:
            case SyncStatus.UPDATE_INSTALLED:
            case SyncStatus.UP_TO_DATE:
              // PopupManager.dismissLoading();
              break;
            default:
              return;
          }
        },
        (progress) => {},
        (update) => {},
      );
    }
    appState.current = nextAppState;
  };

  const renderOverlay = useMemo(() => {
    const displayStyle: ViewStyle = { display: display <= 0 ? 'none' : 'flex' };
    return (
      <View style={[StyleSheet.absoluteFill, styles.overlay, displayStyle]}>
        <LottieView
          source={assets.lottie.spinner}
          autoPlay
          loop
          style={styles.img}
        />
      </View>
    );
  }, [display]);

  const renderPopup = useMemo(() => {
    if (notifies.length === 0) {
      return null;
    }
    return (
      <View style={[StyleSheet.absoluteFill, styles.popup]}>
        {notifies.map((notify, i) => (
          <Popup
            key={`${i}`}
            notify={notify}
            onCancelPopup={onCancelPopup.bind(null, notify)}
            onUpdatePopup={onUpdatePopup}
          />
        ))}
      </View>
    );
  }, [notifies, onCancelPopup, onUpdatePopup]);

  console.log('notifies', notifies);

  return (
    <DatabaseProvider database={database}>
      <View style={styles.flex}>
        <MainStackScreen />
        {renderOverlay}
        {renderPopup}
      </View>
    </DatabaseProvider>
  );
};

const size = Math.min(constants.width, constants.height) / 4;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  overlay: {
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  popup: {
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    zIndex: 101,
  },
  popupContent: {
    top: constants.height / 4,
    backgroundColor: colors.white,
    // marginHorizontal: constants.dfPadding,
    padding: constants.dfPadding,
    borderRadius: constants.halfPadding,
    position: 'absolute',
    minHeight: constants.height / 4,
    left: constants.dfPadding,
    right: constants.dfPadding,
  },
  popupTitle: {
    fontSize: variants.h4,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  popupForm: {
    marginTop: constants.dfPadding,
  },
  popupText: {
    fontSize: variants.title,
    marginTop: constants.quarterPadding,
  },
  popupInput: {
    backgroundColor: colors.black1,
    borderRadius: 2,
    padding: constants.dfPadding,
    paddingVertical: constants.halfPadding,
    marginTop: 2,
  },
  popupButtons: {
    flexDirection: 'row',
    marginTop: constants.dfPadding,
  },
  popupButton: {
    flex: 1,
    marginHorizontal: constants.quarterPadding,
  },
  spinnerWrapper: {
    width: size,
    height: size,
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    width: size,
    height: size,
  },
  label: {
    color: colors.white,
    textAlign: 'center',
    fontSize: variants.title,
  },
});

export default codePush()(App);
