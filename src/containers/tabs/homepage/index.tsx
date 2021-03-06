import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { UIKit } from '@uikit';
import { DeviceManager, PopupPrototype } from '@utils';
import styles from './styles';
import { _t } from '@i18n';
import { fetchAPI, HttpResponse } from '@services';
import Carousel from 'react-native-snap-carousel';
import { IStack } from 'screen-props';
import { colors, constants } from '@values';
import { assets } from '@assets';
import { routes } from '@navigator/routes';

interface Props extends IStack {}

const sliderWidth = constants.width;
const itemWidth = constants.width * 0.8;

const Homepage = memo((props: Props) => {
  const [shopInfo, setShopInfo] = useState<HttpResponse>();

  const getData = useCallback(() => {
    PopupPrototype.showOverlay();
    fetchAPI('get/auth/app/shop/info', 'get').then((response) => {
      setShopInfo(response);
      PopupPrototype.dismissOverlay();
    });
  }, []);

  useEffect(getData, []);
  const onPostProduct = useCallback(
    () => props.navigation.navigate(routes.productDetail),
    [],
  );
  const onPostPromo = useCallback(
    () => props.navigation.navigate(routes.promoDetail),
    [],
  );

  const keyExtractor = useCallback((_, index) => `${index}`, []);

  const onMakeCall = useCallback(
    (phone: string) => DeviceManager.makeCall(phone),
    [],
  );

  const mailTo = useCallback(
    (email: string) => DeviceManager.mailTo(email),
    [],
  );

  const onItemPress = useCallback((item: any) => {
    props.navigation.navigate(routes.productDetail, {
      data: item,
      title: item.name,
    });
  }, []);

  const renderItem = useCallback((info: { item: any; index: number }) => {
    return (
      <UIKit.Touchable
        onPress={onItemPress.bind(null, info.item)}
        style={styles.carouselItem}>
        <UIKit.FastImage
          source={{ uri: info.item.medias?.[0]?.source }}
          style={styles.sliderImage}
          resizeMode="cover"
        />
      </UIKit.Touchable>
    );
  }, []);

  const renderInfo = useCallback((info: any) => {
    const { shop = {}, email = '', phone = '' } = info || {};
    const { info_array = [], value_array = [], products = [] } = shop;
    const len = info_array.length;

    return (
      <UIKit.Container>
        <UIKit.KeyboardAwareScrollView>
          <UIKit.Text style={styles.titleStatistical}>
            {_t('statisticalShop')}
          </UIKit.Text>
          {info_array.map((item: string, index: number) => (
            <UIKit.View style={styles.itemWrapper} key={`${index}`}>
              <UIKit.View style={styles.item}>
                <UIKit.Text style={styles.titleLeft}>{item}</UIKit.Text>
                <UIKit.Text style={styles.title}>
                  {value_array[index]}
                </UIKit.Text>
              </UIKit.View>
              {index < len - 1 ? <UIKit.View style={styles.line} /> : null}
            </UIKit.View>
          ))}
          <UIKit.View style={styles.carousel}>
            <Carousel
              data={products}
              renderItem={renderItem}
              sliderWidth={sliderWidth}
              itemWidth={itemWidth}
              sliderHeight={sliderWidth / 2}
              keyExtractor={keyExtractor}
              autoplay
              autoplayInterval={3000}
              loop
            />
          </UIKit.View>

          <UIKit.View marginT={constants.dfPadding}>
            <UIKit.Touchable
              style={styles.contactWrapper}
              onPress={onMakeCall.bind(null, phone)}>
              <UIKit.Image
                source={assets.icon.ic_make_call}
                style={styles.contactIcon}
                tintColor={colors.button}
              />
              <UIKit.Text style={styles.contactTitle}>
                {_t('callTo')} {phone}
              </UIKit.Text>
            </UIKit.Touchable>

            <UIKit.Touchable
              style={styles.contactWrapper}
              onPress={mailTo.bind(null, email)}>
              <UIKit.Image
                source={assets.icon.ic_compose_email}
                style={styles.contactIcon}
                tintColor={colors.button}
              />
              <UIKit.Text style={styles.contactTitle}>
                {_t('mailTo')} {email}
              </UIKit.Text>
            </UIKit.Touchable>
          </UIKit.View>
        </UIKit.KeyboardAwareScrollView>
      </UIKit.Container>
    );
  }, []);

  const renderShopInfo = useMemo(() => {
    if (!shopInfo) {
      return null;
    }
    if (shopInfo.error) {
      return (
        <UIKit.View style={styles.errorFetching}>
          <UIKit.Touchable onPress={getData}>
            <UIKit.Empty label={_t('errorFetching')} />
          </UIKit.Touchable>
        </UIKit.View>
      );
    }
    return renderInfo(shopInfo.data);
  }, [shopInfo, renderInfo]);

  return (
    <UIKit.Container>
      <UIKit.View style={styles.topButtons}>
        <UIKit.ButtonText
          title={_t('postProduct')}
          underline
          textStyle={styles.topButtonText}
          onPress={onPostProduct}
        />
        <UIKit.ButtonText
          title={_t('postPromotion')}
          marginL={constants.dfPadding}
          underline
          textStyle={styles.topButtonText}
          onPress={onPostPromo}
        />
      </UIKit.View>
      {renderShopInfo}
    </UIKit.Container>
  );
});

export default Homepage;
