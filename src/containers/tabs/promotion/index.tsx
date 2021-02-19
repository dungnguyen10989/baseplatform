import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { UIKit } from '@uikit';
import { PopupPrototype, StringPrototype } from '@utils';
import styles from './styles';
import { _t } from '@i18n';
import { fetchAPI, HttpResponse } from '@services';
import { IStack } from 'screen-props';
import { colors, constants, variants } from '@values';

interface Props extends IStack {}

const Homepage = memo((props: Props) => {
  const [products, setProducts] = useState<HttpResponse>();

  const getData = useCallback(() => {
    PopupPrototype.showOverlay();
    fetchAPI('get/auth/app/shop/product', 'get').then((response) => {
      setProducts(response);
      PopupPrototype.dismissOverlay();
    });
  }, []);

  useEffect(getData, []);

  const renderItem = useCallback((info: { item: any; index: number }) => {
    return (
      <UIKit.Touchable
        style={[
          styles.item,
          info.index % 2 === 0 ? styles.itemLeft : styles.itemRight,
        ]}>
        <UIKit.FastImage
          source={{ uri: info.item.medias?.[0].source }}
          style={styles.img}
        />
        <UIKit.Text style={styles.name}>{info.item.name}</UIKit.Text>
        <UIKit.Text style={styles.amount}>
          {StringPrototype.toCurrency(info.item.amount)}
        </UIKit.Text>
      </UIKit.Touchable>
    );
  }, []);

  const renderHeader = useCallback(
    () => <UIKit.Text style={styles.title}>{_t('_nav.tab1')}</UIKit.Text>,
    [],
  );

  const renderInfo = useCallback((data: any[]) => {
    return (
      <UIKit.FlatList
        data={data}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        numColumns={2}
        contentContainerStyle={styles.list}
        separator={
          <UIKit.Divider
            color={colors.transparent}
            thickness={constants.dfPadding}
          />
        }
      />
    );
  }, []);

  const renderContent = useMemo(() => {
    if (!products) {
      return null;
    }
    if (!products.success) {
      return (
        <UIKit.View style={styles.errorFetching}>
          <UIKit.Touchable onPress={getData}>
            <UIKit.Empty label={_t('errorFetching')} />
          </UIKit.Touchable>
        </UIKit.View>
      );
    }
    return renderInfo(products.data?.products?.data);
  }, [products, renderInfo]);

  return (
    <UIKit.Container PADDING_H>
      <UIKit.ButtonText
        title={_t('postProduct')}
        underline
        color={colors.brightRed}
        fontSize={variants.subTitle}
        style={styles.postProduct}
        bold
      />
      {renderContent}
    </UIKit.Container>
  );
});

export default Homepage;
