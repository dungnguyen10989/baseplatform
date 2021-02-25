import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { UIKit } from '@uikit';
import { PopupPrototype, StringPrototype } from '@utils';
import styles from './styles';
import { _t } from '@i18n';
import { fetchAPI, HttpResponse } from '@services';
import { IStack } from 'screen-props';
import { colors, constants, variants } from '@values';
import { assets } from '@assets';
import { routes } from '@navigator/routes';

interface Props extends IStack {}

const api = (params?: any) =>
  fetchAPI('get/auth/app/shop/promotion', 'get', params);

const Homepage = memo((props: Props) => {
  const [promos, setPromos] = useState<Array<any>>([]);
  const [error, setError] = useState<any>();
  const [refreshing, setRefreshing] = useState(false);
  const loadingMore = useRef(false);

  const initFetch = useCallback((showLoading?: boolean) => {
    showLoading ? PopupPrototype.showOverlay() : setRefreshing(true);
    api().then((val) => {
      showLoading ? PopupPrototype.dismissOverlay() : setRefreshing(false);
      if (val.data) {
        setPromos(val.data.promotions.data);
        setError(undefined);
      } else {
        setError(val.error);
      }
    });
  }, []);

  useEffect(initFetch.bind(null, true), [initFetch]);
  const onRefresh = useCallback(initFetch, [initFetch]);

  const onLoadMore = useCallback(() => {
    if (!loadingMore.current) {
      loadingMore.current = true;
      const len = promos?.length;
      const page = Math.ceil(len / constants.pageSize) + 1;
      api({ page }).then((val) => {
        loadingMore.current = false;
        if (val.data) {
          val.data.promotions?.data?.forEach((i: any) => {
            if (!promos.find((cus) => cus.id === i.id)) {
              promos.push(i);
            }
          });
          setPromos(promos);
          setError(undefined);
        }
      });
    }
  }, [promos, loadingMore.current]);

  const onItemPress = useCallback((item: any) => {
    props.navigation.navigate(routes.promoDetail, {
      data: item,
      title: item.name,
    });
  }, []);

  const renderItem = useCallback(
    (info: { item: any; index: number }) => {
      return (
        <UIKit.Touchable
          onPress={onItemPress.bind(null, info.item)}
          style={[
            styles.item,
            info.index % 2 === 0 ? styles.itemLeft : styles.itemRight,
          ]}>
          <UIKit.FastImage
            source={{ uri: info.item.medias?.[0]?.source }}
            withSandWatch
            style={styles.img}
          />
          <UIKit.Text style={styles.name}>{info.item.name}</UIKit.Text>
          <UIKit.Text style={styles.amount}>
            {StringPrototype.toCurrency(info.item.amount)}
          </UIKit.Text>
        </UIKit.Touchable>
      );
    },
    [onItemPress],
  );

  const renderHeader = useCallback(
    () => <UIKit.Text style={styles.title}>{_t('_nav.tab2')}</UIKit.Text>,
    [],
  );

  const renderInfo = useCallback((data: any[]) => {
    return (
      <UIKit.FlatList
        data={data}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onEndReached={onLoadMore}
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
    if (error) {
      return (
        <UIKit.View style={styles.errorFetching}>
          <UIKit.Touchable onPress={initFetch}>
            <UIKit.Empty label={_t('errorFetching')} />
          </UIKit.Touchable>
        </UIKit.View>
      );
    }
    return renderInfo(promos);
  }, [promos, renderInfo]);

  return (
    <UIKit.Container paddingH>
      <UIKit.ButtonText
        title={_t('postPromotion')}
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
