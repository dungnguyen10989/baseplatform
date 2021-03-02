import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { UIKit } from '@uikit';
import { PopupPrototype, StringPrototype } from '@utils';
import styles from './styles';
import { _t } from '@i18n';
import { IStack } from 'screen-props';
import { constants } from '@values';
import { routes } from '@navigator/routes';
import { RootState, useAppDispatch } from '@state/';
import { shallowEqual, useSelector } from 'react-redux';
import { customerHisActions } from '@state/customerHis';

interface Props extends IStack {}

const CustomerDetail = memo((props: Props) => {
  const customer = useRef<any>(props.route.params?.data).current;
  const dispatch = useAppDispatch();
  const data = useSelector(
    (state: RootState) => state.customerHis.data?.asMutable(),
    shallowEqual,
  );
  const error = useSelector(
    (state: RootState) => state.customer.error,
    shallowEqual,
  );
  const [refreshing, setRefreshing] = useState(false);
  const { navigate } = props.navigation;
  const loadingMore = useRef(false);

  const init = useCallback(() => {
    const callback = () => PopupPrototype.dismissOverlay();
    PopupPrototype.showOverlay();
    dispatch(
      customerHisActions.getList.start({ id: customer.id }, callback, callback),
    );
  }, []);

  useEffect(init, [init]);

  const onRefresh = useCallback(() => {
    const callback = () => setRefreshing(false);
    setRefreshing(true);
    dispatch(
      customerHisActions.getList.start({ id: customer.id }, callback, callback),
    );
  }, []);

  const onLoadMore = useCallback(() => {
    if (!loadingMore.current) {
      loadingMore.current = true;
      const len = data.length;
      const page = Math.ceil(len / constants.pageSize) + 1;
      dispatch(customerHisActions.getList.start({ id: customer.id, page }));
    }
  }, [data, loadingMore.current]);

  const renderHeader = useCallback(
    () => (
      <UIKit.View style={styles.title}>
        <UIKit.Text>{_t('_nav.tab3')}:</UIKit.Text>
        <UIKit.Text style={styles.name}>{customer.fullname}</UIKit.Text>
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
          <UIKit.Touchable onPress={init}>
            <UIKit.Empty label={_t('errorFetching')} />
          </UIKit.Touchable>
        </UIKit.View>
      ) : (
        <UIKit.FlatList
          data={data}
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
