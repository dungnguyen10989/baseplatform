import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { UIKit } from '@uikit';
import { PopupPrototype, StringPrototype } from '@utils';
import styles from './styles';
import { _t } from '@i18n';
import { IStack } from 'screen-props';
import { colors, constants } from '@values';
import { routes } from '@navigator/routes';
import { RootState, useAppDispatch } from '@state/';
import { orderActions } from '@state/orders';
import { shallowEqual, useSelector } from 'react-redux';
import { memoize } from 'lodash';

interface Props extends IStack {}

const dataSelector = memoize((state: RootState) =>
  state.order.data?.asMutable(),
);
const errorSelector = memoize((state: RootState) => state.order.error);

const Orders = memo((props: Props) => {
  const dispatch = useAppDispatch();
  const data = useSelector(dataSelector, shallowEqual);
  const error = useSelector(errorSelector, shallowEqual);
  const [refreshing, setRefreshing] = useState(false);
  const { navigate } = props.navigation;
  const loadingMore = useRef(false);

  const init = useCallback(() => {
    const callback = () => PopupPrototype.dismissOverlay();
    PopupPrototype.showOverlay();
    dispatch(orderActions.getList.start(undefined, callback, callback));
  }, [dispatch]);

  useEffect(init, [init]);

  const onRefresh = useCallback(() => {
    const callback = () => {
      setRefreshing(false);
    };
    setRefreshing(true);
    dispatch(orderActions.getList.start(undefined, callback, callback));
  }, [dispatch]);

  const onLoadMore = useCallback(() => {
    if (!loadingMore.current) {
      loadingMore.current = true;
      const len = data.length;
      const page = Math.ceil(len / constants.pageSize) + 1;
      dispatch(orderActions.getList.start({ page }));
    }
  }, [data, dispatch]);

  // const onItemPress = useCallback(
  //   (item: any) => {
  //     navigate(routes.customerDetail, { data: item });
  //   },
  //   [navigate],
  // );

  const onFinish = useCallback(
    (item: any) => {
      dispatch(
        orderActions.updateStatus.start({
          order_id: item.order_id,
          total_amount: item.total_amount,
        }),
      );
    },
    [dispatch],
  );

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
          // onPress={onItemPress.bind(null, item)}
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
              {!item.is_success ? (
                <UIKit.Touchable
                  onPress={onFinish.bind(null, item)}
                  style={styles.unFinished}>
                  <UIKit.Text color={colors.white}>{item.status}</UIKit.Text>
                </UIKit.Touchable>
              ) : (
                <UIKit.View style={styles.finished}>
                  <UIKit.Text color={colors.skyBlue}>{item.status}</UIKit.Text>
                </UIKit.View>
              )}
            </UIKit.View>
          }
        />
      );
    },
    [onFinish],
  );

  return (
    <UIKit.View flex>
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
          // ListHeaderComponent={renderHeader}
          refreshing={refreshing}
          onRefresh={onRefresh}
          onEndReached={onLoadMore}
        />
      )}
    </UIKit.View>
  );
});

export default Orders;
