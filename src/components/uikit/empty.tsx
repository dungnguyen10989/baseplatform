import React, { ComponentType, memo } from 'react';
import { StyleSheet, View, StyleProp, ViewStyle } from 'react-native';
import { IModifiersTest } from 'custom-ui-kit';
import FastImage from 'react-native-fast-image';
import i18n from 'i18n-js';

import { assets } from '@assets';
import { variants, constants, colors } from '@values';
import Text from './text';

interface IEmptyProps extends IModifiersTest {
  color?: string;
  iconSize?: number;
  label?: string;
  style?: StyleProp<ViewStyle>;
}

const FuncComponent = (props: IEmptyProps) => {
  const { color, iconSize, label } = props;
  const style = { width: iconSize, height: iconSize };

  return (
    <View style={[styles.emptyW, props.style]}>
      <FastImage
        source={assets.icon.ic_empty}
        style={style}
        resizeMode="contain"
        tintColor={color}
      />
      <Text style={styles.text} color={color}>
        {label || i18n.t('emptyData')}
      </Text>
    </View>
  );
};

(FuncComponent as ComponentType<IEmptyProps>).defaultProps = {
  color: colors.gray,
  iconSize: Math.max(constants.width / 2.5, 120),
};

export default memo(FuncComponent);

const styles = StyleSheet.create({
  emptyW: {
    flex: 1,
    paddingBottom: constants.bottomSpace,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: variants.title,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
