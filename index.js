import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import 'react-native-gesture-handler';
import { setI18nConfig } from '@i18n';

if (__DEV__) {
  import('./reactotron');
}
setI18nConfig();
AppRegistry.registerComponent(appName, () => App);
