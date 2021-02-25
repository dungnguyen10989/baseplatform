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

const api = (id: string, params?: any) =>
  fetchAPI(`get/auth/app/customer/${id}`, 'get', params);

const CustomerDetail = memo((props: Props) => {
  const customer = useRef<any>(props.route.params?.data);
  const [histories, setHistories] = useState<Array<any>>([]);
  const [error, setError] = useState<any>();
  const [refreshing, setRefreshing] = useState(false);
  const { navigate } = props.navigation;
  const loadingMore = useRef(false);

  const initFetch = useCallback(
    (showLoading?: boolean) => {
      if (!customer.current) {
        return;
      }
      showLoading ? PopupPrototype.showOverlay() : setRefreshing(true);
      api(customer.current.id).then((val) => {
        showLoading ? PopupPrototype.dismissOverlay() : setRefreshing(false);
        if (val.data) {
          setHistories(val.data.histories);
          setError(undefined);
        } else {
          setError(val.error);
        }
      });
    },
    [customer.current],
  );

  useEffect(initFetch.bind(null, true), [initFetch]);
  const onRefresh = useCallback(initFetch, [initFetch]);

  const onLoadMore = useCallback(() => {
    if (!loadingMore.current) {
      loadingMore.current = true;
      const len = histories?.length;
      const page = Math.ceil(len / constants.pageSize) + 1;
      api(customer.current?.id, { page }).then((val) => {
        loadingMore.current = false;
        if (val.data) {
          val.data.histories?.forEach((i: any) => {
            if (!histories.find((cus) => cus.id === i.id)) {
              histories.push(i);
            }
          });
          setHistories(histories);
          setError(undefined);
        }
      });
    }
  }, [histories, loadingMore.current]);

  const renderHeader = useCallback(
    () => (
      <UIKit.View style={styles.title}>
        <UIKit.Text>{_t('_nav.tab3')}:</UIKit.Text>
        <UIKit.Text style={styles.name}>
          {customer.current?.fullname}
        </UIKit.Text>
      </UIKit.View>
    ),
    [customer.current],
  );

  const onItemPress = useCallback((item: any) => {
    navigate(routes.productDetail, { data: item, title: item.name });
  }, []);

  const renderItem = useCallback(
    (info: { item: any; index: number }) => {
      const { item } = info;
      return (
        <UIKit.View style={styles.item}>
          <UIKit.View style={styles.row}>
            <UIKit.Text style={[styles.itemLeft, styles.itemTitle]}>
              {item.product_name}
            </UIKit.Text>
            <UIKit.Text style={[styles.itemRight]}>
              {StringPrototype.toCurrency(item.total_point, 0)}
            </UIKit.Text>
          </UIKit.View>
          <UIKit.View style={[styles.row, styles.below]}>
            <UIKit.Text style={[styles.itemLeft, styles.itemUpdated]}>
              {`${_t('at')}: `} {item.updated_at}
            </UIKit.Text>
            <UIKit.Text style={[styles.itemRight, styles.amount]}>
              {StringPrototype.toCurrency(item.total_amount, 0)}
            </UIKit.Text>
          </UIKit.View>
        </UIKit.View>
      );
    },
    [onItemPress],
  );

  return (
    <UIKit.Container>
      {error ? (
        <UIKit.View style={styles.errorFetching}>
          <UIKit.Touchable onPress={initFetch}>
            <UIKit.Empty label={_t('errorFetching')} />
          </UIKit.Touchable>
        </UIKit.View>
      ) : (
        <UIKit.FlatList
          data={histories}
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

export default CustomerDetail;
