import React, { ComponentType, memo, useMemo } from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import FastImage, { FastImageProps } from 'react-native-fast-image';
import {
  IModifiersTest,
  IModifiersSpacing,
  IModifiersLayout,
  IModifiersStyling,
} from 'custom-ui-kit';
import { isNumber } from 'lodash';
import { destructPropsToStyle } from './helper';
import Touchable from './touchable';

interface IImageProps
  extends FastImageProps,
    IModifiersSpacing,
    IModifiersStyling,
    IModifiersLayout,
    IModifiersTest {
  size?: number | [number, number];
  onPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
}

const FuncComponent = (props: IImageProps) => {
  const { style, size, onPress, containerStyle, ...rest } = props;

  const result = useMemo(() => {
    const { _styles, _props } = destructPropsToStyle(rest);
    const s = StyleSheet.flatten([
      style,
      _styles.layoutStyle,
      _styles.spacingStyle,
      _styles.stylingStyle,
    ]);
    return { s, p: _props };
  }, [rest, style]);

  const enhanceSize = Array.isArray(size)
    ? { width: size[0], height: size[1] }
    : isNumber(size)
    ? { width: size, height: size }
    : undefined;
  const enhanceStyle = Object.assign({}, style, result.s, enhanceSize);

  if (typeof onPress === 'function') {
    return (
      <Touchable onPress={onPress} style={containerStyle}>
        <FastImage {...result.p} style={enhanceStyle} />
      </Touchable>
    );
  }

  return <FastImage {...result.p} style={enhanceStyle} />;
};

(FuncComponent as ComponentType<IImageProps>).defaultProps = {
  resizeMode: 'cover',
};

export default memo(FuncComponent);
