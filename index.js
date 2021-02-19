import { AppRegistry, LogBox } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import 'react-native-gesture-handler';
import { setI18nConfig } from '@i18n';
import './src/utils/patch';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

if (__DEV__) {
  import('./reactotron');
}
setI18nConfig();
AppRegistry.registerComponent(appName, () => App);
