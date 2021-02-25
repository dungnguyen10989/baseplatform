import React, {
  ComponentType,
  memo,
  PropsWithChildren,
  useCallback,
  useMemo,
} from 'react';
import {
  TouchableOpacityProps,
  StyleSheet,
  ActivityIndicator,
  GestureResponderEvent,
  TextStyle,
  StyleProp,
  TouchableOpacity,
  Text,
  ViewStyle,
} from 'react-native';
import {
  IModifiersSpacing,
  IModifiersStyling,
  IModifiersText,
  IModifiersLayout,
  IModifiersTest,
} from 'custom-ui-kit';

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
  loading?: boolean;
  indicatorColor?: string;
  indicatorSize?: 'large' | 'small';
  disabledBg?: string;
  disabledColor?: string;
}

const FuncComponent = memo((props: PropsWithChildren<Props>) => {
  const {
    textStyle,
    style,
    title,
    loading,
    indicatorColor,
    indicatorSize,
    disabledBg,
    disabledColor,
    onPress,
    disabled,
    ...rest
  } = props;

  const { _props, _styles } = useMemo(() => destructPropsToStyle(rest), [rest]);

  const _onPress = useCallback(
    (e: GestureResponderEvent) => {
      !loading && onPress?.(e);
    },
    [loading, onPress],
  );

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

  if (disabled) {
    containerStyle.backgroundColor = disabledBg;
    _textStyle.color = disabledColor;
  }

  return (
    <TouchableOpacity
      {..._props}
      onPress={_onPress}
      disabled={disabled}
      style={containerStyle}>
      {loading ? (
        <ActivityIndicator size={indicatorSize} color={indicatorColor} />
      ) : (
        <Text style={_textStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
});

(FuncComponent as ComponentType<Props>).defaultProps = {
  indicatorSize: 'small',
  br: 2,
  disabledBg: colors.gray,
  disabledColor: colors.white,
  indicatorColor: colors.white,
  fontSize: variants.title,
  bg: colors.primaryBlue,
  bold: false,
  color: colors.white,
  paddingV: constants.dfPadding * 0.75,
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
