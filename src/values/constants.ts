import { Dimensions, Platform, StatusBar } from 'react-native';
import { normalize } from '@utils/responsive';

const { width, height } = Dimensions.get('window');

const isIphoneX =
  Platform.OS === 'ios' &&
  !Platform.isPad &&
  !Platform.isTVOS &&
  (width > 780 || height > 780);

enum FeatureStatus {
  ON = 'ON',
  OFF = 'OFF',
  MAINTAIN = 'MAINTAIN',
  ANDROID_ONLY = 'ANDROID_ONLY',
  IOS_ONLY = 'IOS_ONLY',
}

enum FeatureType {
  DEFAULT = 'DEFAULT',
  CONFIG = 'CONFIG',
}

const dims = {
  dfPadding: 16,
  halfPadding: 8,
  width,
  height,
  isIphoneX,
  isAndroid: Platform.OS === 'android',
  isIphone: Platform.OS === 'ios' && !Platform.isPad && !Platform.isTVOS,
  statusBarHeight: Platform.select({
    ios: isIphoneX ? 44 : 30,
    android: StatusBar.currentHeight,
    default: 0,
  }),
};

const colors = {
  white: '#fff',
  silver: 'silver',
  gray: 'gray',
  black: '#000',
};

const variants = {
  h1: normalize(28),
  h2: normalize(24),
  h3: normalize(20),
  h4: normalize(18),
  title: normalize(16),
  normal: normalize(14),
  subTitle: normalize(12),
  caption: normalize(10),
};

export { dims, colors, variants, FeatureStatus, FeatureType };
