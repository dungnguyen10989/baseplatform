import React, {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { UIKit } from '@uikit';
import { PopupPrototype, StringPrototype } from '@utils';
import styles from './styles';
import { _t } from '@i18n';
import { IStack } from 'screen-props';
import { colors, constants, variants } from '@values';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { routes } from '@navigator/routes';
import { RootState, useAppDispatch } from '@state/';
import { customerActions } from '@state/customer';
import { shallowEqual, useSelector } from 'react-redux';
import { isNumber, memoize } from 'lodash';
import Customers from './customers';
import Orders from './orders';
import json from '@nozbe/watermelondb/decorators/json';

interface Props extends IStack {}

const dataSelector = memoize((state: RootState) =>
  state.customer.data?.asMutable(),
);
const errorSelector = memoize((state: RootState) => state.customer.error);

const Customer = memo((props: Props) => {
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

// export default Customers;

const initialLayout = { width: constants.width };

export default memo((props: Props) => {
  const [index, setIndex] = React.useState(0);
  const [scenes] = React.useState([
    { key: 'first', title: _t('customerList') },
    { key: 'second', title: _t('manageOrders') },
  ]);

  useEffect(() => {
    const { index: _index } = props.route.params || {};
    if (_index && isNumber(_index)) {
      setIndex(_index);
    }
  }, [props]);

  const renderScene = useMemo(
    () =>
      SceneMap({
        first: () => <Customers {...props} />,
        second: () => <Orders {...props} />,
      }),
    [props],
  );

  const renderTabBar = useCallback((p) => {
    return (
      <TabBar
        style={styles.header}
        labelStyle={styles.headerLabel}
        // renderLabel={(p1: any) => {
        //   return (
        //     <UIKit.Text
        //       style={{ backgroundColor: 'red', flex: 1 }}
        //       bold={p1.focused}
        //       fontSize={variants.title}
        //       color={p1.color}>
        //       {p1.route.title}
        //     </UIKit.Text>
        //   );
        // }}
        {...p}
      />
    );
  }, []);

  return (
    <TabView
      navigationState={{ index, routes: scenes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={initialLayout}
      renderTabBar={renderTabBar}
    />
  );
});
