import React, {
  useState,
  MutableRefObject,
  useCallback,
  memo,
  useRef,
} from 'react';
import { WebView, WebViewNavigation } from 'react-native-webview';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { IStack } from 'screen-props';
import { _t } from '@i18n';
import { assets } from '@assets';
import { colors, constants, variants } from '@values';
import { routes } from '@navigator/routes';
import { UIKit } from '@uikit';
import Header from '../header';

interface Props extends IStack {}

const ProductDetail = memo((props: Props) => {
  console.log('propssss', props);

  return (
    <UIKit.Container>
      <UIKit.Button
        title="back"
        onPress={() => {
          props.navigation.pop();
        }}
      />
    </UIKit.Container>
  );
});

export default ProductDetail;
