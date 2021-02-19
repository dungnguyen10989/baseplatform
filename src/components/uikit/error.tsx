import React, { ComponentType, memo, useMemo } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { IModifiersTest } from 'custom-ui-kit';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Touchable from './touchable';
import Text from './text';

import { variants, constants, colors } from '@values';
import i18n from 'i18n-js';

interface IErrorProps extends IModifiersTest {
  iconColor?: string;
  titleColor?: string;
  iconSize?: number;
  flex?: boolean;
  onReload?: () => void;
  title?: string;
  style?: StyleProp<ViewStyle>;
}

const FuncComponent = (props: IErrorProps) => {
  const { iconSize, iconColor, onReload, titleColor, title, style } = props;
  const textStyle = useMemo(() => [styles.text, { color: titleColor }], [
    titleColor,
  ]);

  return (
    <Touchable style={[styles.container, style]} onPress={onReload}>
      <Ionicons name="ios-alert-circle" color={iconColor} size={iconSize} />
      {title ? <Text style={textStyle}>{title}</Text> : null}
    </Touchable>
  );
};

(FuncComponent as ComponentType<IErrorProps>).defaultProps = {
  iconColor: 'tomato',
  iconSize: 60,
  titleColor: colors.gray,
  flex: true,
};

export default memo(FuncComponent);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  flex: {
    paddingBottom: constants.bottomSpace,
    flex: 1,
  },
  text: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  btn: {
    marginTop: constants.dfPadding,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rs: {
    fontSize: variants.h3,
    fontWeight: 'bold',
    marginTop: 7,
  },
});
