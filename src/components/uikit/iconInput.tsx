import React, { forwardRef, memo } from 'react';
import { StyleProp, StyleSheet, ViewStyle, TextInput } from 'react-native';
import { isNumber } from 'lodash/fp';
import { ITextFieldProps } from './input';
import { colors, constants } from '@values';
import FastImage from './fastImage';
import View from './view';
import TextField from './input';
import { ImageStyle } from 'react-native-fast-image';

interface Props extends ITextFieldProps {
  iconSource: string | number;
  iconStyle?: StyleProp<ImageStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}

const IconInput = memo(
  forwardRef<TextInput, Props>((props, ref) => {
    const {
      iconSource: source,
      iconStyle,
      containerStyle,
      style,
      ...rest
    } = props;
    return (
      <View style={[styles.container, containerStyle]}>
        <FastImage
          source={isNumber(source) ? source : { uri: source }}
          style={[styles.icon, iconStyle]}
          tintColor={colors.textColor}
        />
        <TextField
          {...rest}
          ref={ref as any}
          containerStyle={styles.input}
          borderWidth={0}
        />
      </View>
    );
  }),
);

export default IconInput;

const styles = StyleSheet.create({
  container: {
    borderRadius: 5,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.silver,
    padding: constants.halfPadding,
  },
  icon: {
    width: 20,
    height: 20,
  },
  input: {
    flex: 1,
    marginLeft: constants.halfPadding,
  },
});
