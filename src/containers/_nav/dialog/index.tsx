import React, { memo, useCallback, useEffect } from 'react';
import LottieView from 'lottie-react-native';
import { StyleSheet, Text, View, DeviceEventEmitter } from 'react-native';
import { IOverlay, IStack } from 'screen-props';
import { assets } from '@assets';
import { colors, constants, events, variants } from '@values';
import { UIKit } from '@uikit';

interface Props extends IStack {}

export default memo((props: Props) => {
  const params: IOverlay | undefined = props.route.params;
  const { style, img, label } = params || {};

  const dismissDialog = useCallback(() => props.navigation.pop(), []);

  useEffect(() => {
    DeviceEventEmitter.addListener(events.dismissDialog, dismissDialog);
    return () =>
      DeviceEventEmitter.removeListener(events.dismissDialog, dismissDialog);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.spinnerWrapper}>
        {/* <UIKit.Button title="press" onPress={() => alert(1)} /> */}
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
});

const size = Math.min(constants.width, constants.height) / 4;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: constants.dfPadding,
    backgroundColor: colors.overlay,
  },
  spinnerWrapper: {
    width: size,
    height: size,
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    width: size / 2,
    height: size / 2,
  },
  label: {
    color: colors.white,
    textAlign: 'center',
    fontSize: variants.title,
  },
});
