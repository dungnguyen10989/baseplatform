import { assets } from '@assets';
import { colors, constants, variants } from '@values';
import React, { memo, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { IStack } from 'screen-props';
import { UIKit } from '@uikit';

interface Props {
  onBack: () => void;
  title: string;
}

const HeaderText = memo((props: Props) => {
  return (
    <UIKit.View style={styles.wrapper}>
      <UIKit.Touchable onPress={props.onBack}>
        <UIKit.FastImage
          tintColor={colors.white}
          source={assets.icon.ic_back}
          style={styles.backIcon}
        />
      </UIKit.Touchable>
      <UIKit.Text style={styles.title}>{props.title}</UIKit.Text>
    </UIKit.View>
  );
});

export default HeaderText;

const styles = StyleSheet.create({
  wrapper: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: constants.halfPadding,
  },
  backIcon: {
    width: 28,
    height: 28,
  },
  title: {
    flex: 1,
    marginHorizontal: constants.dfPadding,
    color: colors.white,
    fontSize: variants.h3,
  },
});
