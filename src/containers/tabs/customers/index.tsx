import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { UIKit } from '@uikit';
import { PopupPrototype, StringPrototype } from '@utils';
import styles from './styles';
import { _t } from '@i18n';
import { IStack } from 'screen-props';
import { constants } from '@values';
import { routes } from '@navigator/routes';
import { RootState, useAppDispatch } from '@state/';
import { customerActions } from '@state/customer';
import { shallowEqual, useSelector } from 'react-redux';
import { memoize } from 'lodash';

interface Props extends IStack {}

const dataSelector = memoize((state: RootState) =>
  state.customer.data?.asMutable(),
);
const errorSelector = memoize((state: RootState) => state.customer.error);

const Customers = memo((props: Props) => {
  const dispatch = useAppDispatch();
  const data = useSelector(dataSelector, shallowEqual);
  const error = useSelector(errorSelector, shallowEqual);
  const [refreshing, setRefreshing] = useState(false);
  const { navigate } = props.navigation;
  const loadingMore = useRef(false);

  const init = useCallback(() => {
    const callback = () => PopupPrototype.dismissOverlay();
    PopupPrototype.showOverlay();
    dispatch(customerActions.getList.start(undefined, callback, callback));
  }, []);

  useEffect(init, [init]);

  const onRefresh = useCallback(() => {
    const callback = () => setRefreshing(false);
    setRefreshing(true);
    dispatch(customerActions.getList.start(undefined, callback, callback));
  }, []);

  const onLoadMore = useCallback(() => {
    if (!loadingMore.current) {
      loadingMore.current = true;
      const len = data.length;
      const page = Math.ceil(len / constants.pageSize) + 1;
      dispatch(customerActions.getList.start({ page }));
    }
  }, [data, loadingMore.current]);

  const onPostRedeem = useCallback(() => navigate(routes.postRedeem), []);
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
          source={item.avatar}
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
          title={_t('postRedeem')}
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

export default Customers;
