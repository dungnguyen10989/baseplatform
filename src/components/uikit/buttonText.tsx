import React, { ComponentType, memo, PropsWithChildren, useMemo } from 'react';
import {
  TouchableOpacityProps,
  StyleSheet,
  TextStyle,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {
  IModifiersSpacing,
  IModifiersStyling,
  IModifiersText,
  IModifiersLayout,
  IModifiersTest,
} from 'custom-ui-kit';
import Text from './text';
import Touchable from './touchable';

import { variants, colors, constants } from '@values';

import { destructPropsToStyle } from './helper';

export interface Props
  extends TouchableOpacityProps,
    IModifiersSpacing,
    IModifiersStyling,
    IModifiersText,
    IModifiersLayout,
    IModifiersTest {
  textStyle?: StyleProp<TextStyle>;
  title?: string;
}

const FuncComponent = memo((props: PropsWithChildren<Props>) => {
  const { textStyle, style, title, onPress, disabled, ...rest } = props;
  const { _props, _styles } = useMemo(() => destructPropsToStyle(rest), [rest]);
  const containerStyle: StyleProp<ViewStyle> = StyleSheet.flatten([
    styles.wrapper,
    style,
    _styles.layoutStyle,
    _styles.spacingStyle,
    _styles.stylingStyle,
  ]);
  const _textStyle: StyleProp<TextStyle> = StyleSheet.flatten([
    textStyle,
    _styles.textStyle,
  ]);

  return (
    <Touchable
      {..._props}
      onPress={onPress}
      style={containerStyle}
      disabled={disabled}>
      <Text style={_textStyle}>{title}</Text>
    </Touchable>
  );
});

(FuncComponent as ComponentType<Props>).defaultProps = {
  br: 2,
  fontSize: variants.normal,
  color: colors.textColor,
  paddingV: constants.halfPadding,
};

export default FuncComponent;

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  absolute: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  textW: {
    zIndex: 0,
  },
  transparent: {
    opacity: 0,
  },
});
