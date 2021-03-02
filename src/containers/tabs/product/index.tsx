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
import { IStack } from 'screen-props';
import { colors, constants, variants } from '@values';
import { routes } from '@navigator/routes';
import { RootState, useAppDispatch } from '@state/';
import { useSelector, shallowEqual } from 'react-redux';
import { productActions } from '@state/product';
import { memoize } from 'lodash';

interface Props extends IStack {}

const dataSelector = memoize((state: RootState) =>
  state.product.data?.asMutable(),
);
const errorSelector = memoize((state: RootState) => state.product.error);

const Product = memo((props: Props) => {
  const dispatch = useAppDispatch();
  const data = useSelector(dataSelector, shallowEqual);
  const error = useSelector(errorSelector, shallowEqual);
  const [refreshing, setRefreshing] = useState(false);
  const loadingMore = useRef(false);

  const init = useCallback(() => {
    const callback = () => PopupPrototype.dismissOverlay();
    PopupPrototype.showOverlay();
    dispatch(productActions.getList.start(undefined, callback, callback));
  }, []);

  useEffect(init, [init]);

  const onRefresh = useCallback(() => {
    const callback = () => setRefreshing(false);
    setRefreshing(true);
    dispatch(productActions.getList.start(undefined, callback, callback));
  }, []);

  const onLoadMore = useCallback(() => {
    if (!loadingMore.current) {
      loadingMore.current = true;
      const len = data.length;
      const page = Math.ceil(len / constants.pageSize) + 1;
      dispatch(productActions.getList.start({ page }));
    }
  }, [data, loadingMore.current]);

  const onItemPress = useCallback((item: any) => {
    props.navigation.navigate(routes.productDetail, {
      data: item,
      title: item.name,
    });
  }, []);

  const onCreateProduct = useCallback(() => {
    props.navigation.navigate(routes.productDetail);
  }, []);

  const renderItem = useCallback((info: { item: any; index: number }) => {
    return (
      <UIKit.Touchable
        onPress={onItemPress.bind(null, info.item)}
        style={[
          styles.item,
          info.index % 2 === 0 ? styles.itemLeft : styles.itemRight,
        ]}>
        <UIKit.FastImage
          source={{ uri: info.item.medias?.[0]?.source }}
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

  const renderInfo = useCallback(() => {
    return (
      <UIKit.FlatList
        data={data}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        numColumns={2}
        contentContainerStyle={styles.list}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onEndReached={onLoadMore}
        separator={
          <UIKit.Divider
            color={colors.transparent}
            thickness={constants.dfPadding}
          />
        }
      />
    );
  }, [data]);

  const renderContent = useMemo(() => {
    if (error) {
      return (
        <UIKit.View style={styles.errorFetching}>
          <UIKit.Touchable onPress={init}>
            <UIKit.Empty label={_t('errorFetching')} />
          </UIKit.Touchable>
        </UIKit.View>
      );
    }
    return renderInfo();
  }, [error, renderInfo]);

  return (
    <UIKit.Container paddingH>
      <UIKit.ButtonText
        title={_t('postProduct')}
        underline
        color={colors.brightRed}
        fontSize={variants.subTitle}
        style={styles.postProduct}
        bold
        onPress={onCreateProduct}
      />
      {renderContent}
    </UIKit.Container>
  );
});

export default Product;
