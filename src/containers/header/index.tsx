import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, ImageBackground } from 'react-native';
import { IStack } from 'screen-props';
import {
  mBaseSchema,
  mConfigSchema,
  mFeatureSchema,
  mPostSchema,
} from '@database/schemas';
import { _t } from '@i18n';
import { assets } from '@assets';
import { colors, configs, constants } from '@values';
import { UIKit } from '@uikit';
import { StackHeaderProps, useHeaderHeight } from '@react-navigation/stack';
import { routes } from '@navigator/routes';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import { JsonPrototype, PopupPrototype } from '@utils';

const height = 50;
const avatarSize = 36;
const qrSize = 24;
const margin = 20;

interface Props extends StackHeaderProps {}

const Header = memo((props: Props) => {
  const db = useDatabase();
  const { left, right, top, bottom } = props.insets;
  const [localUser, setLocalUser] = useState<any>({});

  useEffect(() => {
    const get = async () => {
      const _localUser = await mConfigSchema.findConfigByName(db, configs.user);
      _localUser?.observe().subscribe((value) => {
        const { json } = value;
        const obj = JsonPrototype.tryParse(json);
        setLocalUser(obj);
      });
    };
    get();
  }, []);

  const onQR = useCallback(() => {
    props.navigation.navigate(routes.qr);
  }, [props.navigation]);

  const onAvatar = useCallback(() => {
    if (localUser) {
      PopupPrototype.showCameraSheet().then((val) => console.log('valll', val));
      localUser.shop.status_str = 'abc' + new Date().getTime();
      mConfigSchema.addOrUpdateConfig(db, configs.user, localUser);
    }
  }, [props.navigation, localUser]);

  return (
    <UIKit.View style={styles.container}>
      <ImageBackground
        source={assets.image.header_bg}
        style={[styles.imgBackground, { height: height + top }]}
        imageStyle={styles.image}
      />
      <UIKit.View style={styles.content}>
        <UIKit.FastImage
          onPress={onAvatar}
          source={{ uri: localUser?.shop?.logo }}
          style={styles.avatar}
        />
        <UIKit.Text numberOfLines={1} style={styles.title}>
          {localUser?.shop?.status_str}
        </UIKit.Text>
        <UIKit.FastImage
          onPress={onQR}
          source={assets.icon.ic_qr}
          style={styles.qr}
        />
      </UIKit.View>
    </UIKit.View>
  );
});

export default Header;

const styles = StyleSheet.create({
  container: {
    paddingBottom: margin / 2,
    backgroundColor: colors.transparent,
  },
  imgBackground: {
    backgroundColor: colors.transparent,
  },
  image: {
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  content: {
    height,
    position: 'absolute',
    bottom: 4,
    left: margin,
    right: margin,
    backgroundColor: colors.white,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.lightSkyBlue,
    flexDirection: 'row',
    alignItems: 'center',
    padding: height / 2 - avatarSize / 2,
  },
  avatar: {
    width: avatarSize,
    height: avatarSize,
    borderRadius: avatarSize / 2,
    backgroundColor: colors.black1,
  },
  title: {
    flex: 1,
    marginHorizontal: margin / 2,
    color: colors.brightRed,
    fontWeight: 'bold',
  },
  qr: {
    width: qrSize,
    height: qrSize,
  },
});
