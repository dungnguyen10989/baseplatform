import React, { memo, useCallback, useEffect } from 'react';
import LottieView from 'lottie-react-native';
import {
  StyleSheet,
  Text,
  View,
  Image,
  DeviceEventEmitter,
} from 'react-native';
import { IOverlay, IStack } from 'screen-props';
import { assets } from '@assets';
import { colors, constants, events, variants } from '@values';

interface Props extends IStack {}

export default memo((props: Props) => {
  const params: IOverlay | undefined = props.route.params;
  const { style, img, label } = params || {};

  const dismissOverlay = useCallback(() => props.navigation.goBack(), [
    props.navigation,
  ]);

  useEffect(() => {
    const sub = DeviceEventEmitter.addListener(
      events.dismissOverlay,
      dismissOverlay,
    );
    return () => sub.remove();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.spinnerWrapper}>
        <LottieView
          source={assets.lottie.spinner}
          autoPlay
          loop
          style={[StyleSheet.absoluteFill, style]}
        />
        {img ? <Image source={img} style={styles.img} /> : null}
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
