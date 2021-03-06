import React, { useEffect, useRef } from 'react';
import DatabaseProvider from '@nozbe/watermelondb/DatabaseProvider';
import database from './src/database';
import MainStackScreen from './src/navigator';
import { ConsoleUtils } from '@utils/log';
import codePush, { CodePushOptions } from 'react-native-code-push';
import { _t } from '@i18n';
import { AppState, AppStateStatus } from 'react-native';

const App = () => {
  const appState = useRef(AppState.currentState);
  useEffect(() => {
    AppState.addEventListener('change', _handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
    };
  }, []);

  const _handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      console.log('App has come to the foreground!');

      const { SyncStatus } = codePush;

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

  useEffect(() => {
    ConsoleUtils.l('[START APP] db', database);
  });
  return (
    <DatabaseProvider database={database}>
      <MainStackScreen />
    </DatabaseProvider>
  );
};

export default codePush()(App);
