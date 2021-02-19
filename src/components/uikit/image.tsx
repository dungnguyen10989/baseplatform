import React, { ComponentType, memo, useMemo } from 'react';
import { StyleSheet, Image, ImageProps } from 'react-native';
import {
  IModifiersTest,
  IModifiersSpacing,
  IModifiersLayout,
  IModifiersStyling,
} from 'custom-ui-kit';
import { isNumber } from 'lodash';
import { destructPropsToStyle } from './helper';

interface IImageProps
  extends ImageProps,
    IModifiersSpacing,
    IModifiersStyling,
    IModifiersLayout,
    IModifiersTest {
  tintColor?: string;
  size?: number | [number, number];
}

const FuncComponent = (props: IImageProps) => {
  const { style, tintColor, size, ...rest } = props;

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
  const enhanceStyle = Object.assign(
    {},
    style,
    result.s,
    { tintColor },
    enhanceSize,
  );

  return <Image {...result.p} style={enhanceStyle} />;
};

(FuncComponent as ComponentType<IImageProps>).defaultProps = {
  resizeMode: 'cover',
};

export default memo(FuncComponent);
