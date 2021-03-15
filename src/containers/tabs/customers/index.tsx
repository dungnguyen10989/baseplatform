import React, { memo, useCallback, useEffect, useMemo } from 'react';
import styles from './styles';
import { _t } from '@i18n';
import { IStack } from 'screen-props';
import { constants } from '@values';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { isNumber } from 'lodash';
import Customers from './customers';
import Orders from './orders';

interface Props extends IStack {}

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
      <TabBar style={styles.header} labelStyle={styles.headerLabel} {...p} />
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
