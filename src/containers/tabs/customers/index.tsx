import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { UIKit } from '@uikit';
import { PopupPrototype, StringPrototype } from '@utils';
import styles from './styles';
import { _t } from '@i18n';
import { fetchAPI } from '@services';
import { IStack } from 'screen-props';
import { constants } from '@values';
import { routes } from '@navigator/routes';
import { assets } from '@assets';

interface Props extends IStack {}

const api = (params?: any) =>
  fetchAPI('get/auth/app/shop/customer', 'get', params);

const Customers = memo((props: Props) => {
  const [customers, setCustomers] = useState<Array<any>>([]);
  const [error, setError] = useState<any>();
  const [refreshing, setRefreshing] = useState(false);
  const { navigate } = props.navigation;
  const loadingMore = useRef(false);

  const initFetch = useCallback((showLoading?: boolean) => {
    showLoading ? PopupPrototype.showOverlay() : setRefreshing(true);
    api().then((val) => {
      showLoading ? PopupPrototype.dismissOverlay() : setRefreshing(false);
      if (val.data) {
        setCustomers(val.data.customers);
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
      const len = customers?.length;
      const page = Math.ceil(len / constants.pageSize) + 1;
      api({ page }).then((val) => {
        loadingMore.current = false;
        if (val.data) {
          val.data.customers?.forEach((i: any) => {
            if (!customers.find((cus) => cus.id === i.id)) {
              customers.push(i);
            }
          });
          setCustomers(customers);
          setError(undefined);
        }
      });
    }
  }, [customers, loadingMore.current]);

  const onPostRedeem = useCallback(
    () => navigate(routes.postRedeemBonusPoint),
    [],
  );
  const onPushNotification = useCallback(
    () => navigate(routes.pushNotification),
    [],
  );

  const renderHeader = useCallback(
    () => <UIKit.Text style={styles.title}>{_t('customerList')}</UIKit.Text>,
    [],
  );

  const onItemPress = useCallback((item: any) => {
    navigate(routes.customerDetail, { data: item });
  }, []);

  const renderItem = useCallback(
    (info: { item: any; index: number }) => {
      const { item } = info;
      return (
        <UIKit.ListItem
          containerStyle={styles.item}
          title={item.fullname}
          subTitle={item.text}
          caption={item.updated_at}
          source={assets.icon.ic_account}
          titleStyle={styles.itemTitle}
          onPress={onItemPress.bind(null, item)}
          borderBottomWidth={0}
          borderTopWidth={1}
          rightComponent={
            <UIKit.View style={styles.right}>
              <UIKit.Text bold>
                {StringPrototype.toCurrency(item.total_point, 0)}
              </UIKit.Text>
              <UIKit.Text style={styles.amount}>
                {StringPrototype.toCurrency(item.total_amount, 0)}
              </UIKit.Text>
            </UIKit.View>
          }
        />
      );
    },
    [onItemPress],
  );

  return (
    <UIKit.Container>
      <UIKit.View style={styles.topButtons}>
        <UIKit.ButtonText
          title={_t('postRedeemBonusPoint')}
          underline
          textStyle={styles.topButtonText}
          style={styles.topButton}
          onPress={onPostRedeem}
        />
        <UIKit.ButtonText
          title={_t('pushNotification')}
          marginL={constants.dfPadding}
          underline
          textStyle={styles.topButtonText}
          style={styles.topButton}
          onPress={onPushNotification}
        />
      </UIKit.View>
      {error ? (
        <UIKit.View style={styles.errorFetching}>
          <UIKit.Touchable onPress={initFetch}>
            <UIKit.Empty label={_t('errorFetching')} />
          </UIKit.Touchable>
        </UIKit.View>
      ) : (
        <UIKit.FlatList
          data={customers}
          renderItem={renderItem}
          ListHeaderComponent={renderHeader}
          refreshing={refreshing}
          onRefresh={onRefresh}
          onEndReached={onLoadMore}
        />
      )}
    </UIKit.Container>
  );
});

export default Customers;
