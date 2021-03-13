import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import DatabaseProvider from '@nozbe/watermelondb/DatabaseProvider';
import database from './src/database';
import MainStackScreen from './src/navigator';
import { ConsoleUtils } from '@utils/log';
import codePush, { CodePushOptions } from 'react-native-code-push';
import { _t } from '@i18n';
import {
  AppState,
  AppStateStatus,
  DeviceEventEmitter,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { assets } from '@assets';
import { colors, constants, events, variants } from '@values';
import LottieView from 'lottie-react-native';

const { SyncStatus } = codePush;

const App = () => {
  const [display, setDisplay] = useState(0);
  const appState = useRef(AppState.currentState);

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
    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
      showSub.remove();
      dismissSub.remove();
    };
  }, []);

  const _handleShowOverlay = useCallback(() => setDisplay(display + 1), [
    display,
  ]);
  const _handleDismissOverlay = useCallback(() => {
    const newDisplay = Math.max(display - 1, 0);
    setDisplay(newDisplay);
  }, [display]);

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

  return (
    <DatabaseProvider database={database}>
      <View style={styles.flex}>
        <MainStackScreen />
        {renderOverlay}
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
