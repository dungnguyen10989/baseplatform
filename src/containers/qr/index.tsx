import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import { IStack } from 'screen-props';
import { _t } from '@i18n';
import { colors, constants, variants } from '@values';
import { UIKit } from '@uikit';
import { useSelector } from 'react-redux';
import { RootState } from '@state/';
import { memoize } from 'lodash';

interface Props extends IStack {}

const size = Math.min(constants.width, constants.height) * 0.8;
const qrSelector = memoize((state: RootState) => state.values.qr);

const QR = memo((props: Props) => {
  const qr = useSelector(qrSelector);
  const uri = qr ? `data:image/png;base64,${qr}` : 'https://';

  return (
    <UIKit.Container padding style={styles.container}>
      <UIKit.Image source={{ uri }} resizeMode="cover" style={styles.qr} />
      <UIKit.Text style={styles.label}>BABAZA - QRCODE</UIKit.Text>
    </UIKit.Container>
  );
});

export default QR;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: variants.h4,
    fontWeight: 'bold',
    marginTop: constants.dfPadding,
  },
  qr: {
    width: size,
    height: size,
    backgroundColor: colors.black1,
  },
});
