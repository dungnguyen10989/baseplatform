import React, { useMemo } from 'react';
import { StyleProp, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import View from './view';
import Touchable from './touchable';
import Image from './fastImage';
import Text from './text';
import Chevron from './chevron';

import { colors, constants, variants } from '@values';
import { isString } from 'lodash';
import { assets } from '@assets';

const size = 20;

interface Props {
  onPress?: () => void;
  title?: string;
  subTitle?: string;
  source?: number | string;
  iconColor?: string;
  containerStyle?: StyleProp<ViewStyle>;
  iconSize?: number;
  chevronSize?: number;
  chevronColor?: string;
  chevronThickness?: number;
  chevronStyle?: StyleProp<ViewStyle>;
  withChevron?: boolean;
  rightComponent?: JSX.Element;
  borderBottomWidth?: number;
  borderTopWidth?: number;
  borderColor?: string;
  titleStyle?: StyleProp<TextStyle>;
  subTitleStyle?: StyleProp<TextStyle>;
}

const LineItem = (props: Props) => {
  const {
    onPress,
    title,
    subTitle,
    source,
    containerStyle,
    iconSize,
    chevronSize,
    chevronColor,
    chevronThickness,
    chevronStyle,
    withChevron,
    rightComponent,
    borderColor,
    borderBottomWidth,
    borderTopWidth,
    iconColor,
    titleStyle,
    subTitleStyle,
  } = props;

  const iconStyle = useMemo(
    () =>
      iconSize
        ? { ...styles.icon, width: iconSize, height: iconSize }
        : styles.icon,
    [iconSize],
  );

  const borderStyle = useMemo(
    () => ({
      borderBottomWidth,
      borderTopWidth,
      borderColor,
    }),
    [borderBottomWidth, borderTopWidth, borderColor],
  );

  const children = useMemo(
    () => (
      <View style={[styles.container, containerStyle, borderStyle]}>
        <Image
          source={
            isString(source)
              ? { uri: source }
              : source ?? assets.icon.ic_sand_watch
          }
          style={iconStyle}
          tintColor={iconColor}
        />
        <View style={styles.center}>
          <Text style={[styles.title, titleStyle]} numberOfLines={2}>
            {title}
          </Text>
          {subTitle ? (
            <Text style={[styles.subTitle, subTitleStyle]} numberOfLines={2}>
              {subTitle}
            </Text>
          ) : null}
        </View>
        {rightComponent ? (
          rightComponent
        ) : withChevron ? (
          <Chevron
            direction="right"
            size={chevronSize}
            thickness={chevronThickness}
            style={chevronStyle}
            color={chevronColor}
          />
        ) : null}
      </View>
    ),
    [
      containerStyle,
      source,
      title,
      subTitle,
      titleStyle,
      subTitleStyle,
      rightComponent,
      withChevron,
      chevronSize,
      chevronThickness,
      chevronStyle,
      chevronColor,
      iconStyle,
      borderStyle,
    ],
  );

  return typeof onPress === 'function' ? (
    <Touchable onPress={onPress}>{children}</Touchable>
  ) : (
    children
  );
};

(LineItem as React.ComponentType<Props>).defaultProps = {
  borderBottomWidth: 1,
  // borderTopWidth: 1,
  borderColor: colors.silver,
  chevronSize: 12,
  chevronThickness: 2,
  withChevron: true,
  iconColor: colors.gray,
};

export default LineItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: constants.dfPadding,
    backgroundColor: colors.background2,
  },
  flex: {
    flex: 1,
  },
  padding: {
    padding: constants.dfPadding,
  },
  icon: {
    width: size,
    height: size,
  },
  center: {
    flex: 1,
    justifyContent: 'space-around',
    marginHorizontal: constants.dfPadding,
  },
  title: {
    fontSize: variants.title,
    color: colors.textColor,
  },
  subTitle: {
    fontSize: variants.subTitle,
    color: colors.gray,
  },
});
