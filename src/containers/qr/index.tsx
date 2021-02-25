import React, { useState, memo, useEffect, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { IStack } from 'screen-props';
import { mConfigSchema } from '@database/schemas';
import { _t } from '@i18n';
import { colors, configs, constants, variants } from '@values';
import { UIKit } from '@uikit';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import { JsonPrototype, PopupPrototype } from '@utils';
import { silentFetch } from '@services';

interface Props extends IStack {}

const size = Math.min(constants.width, constants.height) * 0.8;

const QR = memo((props: Props) => {
  const db = useDatabase();
  const [qr, setQr] = useState('');

  const onReFetch = useCallback(() => {
    PopupPrototype.showOverlay();
    silentFetch(() => PopupPrototype.dismissOverlay());
  }, []);

  useEffect(() => {
    mConfigSchema.findConfigByName(db, configs.qr).then((value) => {
      if (value) {
        const { json } = value;
        if (json) {
          setQr(JsonPrototype.tryParse(json));
        } else {
          onReFetch();
        }
      }
    });
  }, [onReFetch]);

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
