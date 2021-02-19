import React, {
  useState,
  MutableRefObject,
  useCallback,
  memo,
  useRef,
  useEffect,
} from 'react';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { StyleSheet, View, Image, Text, TextInput } from 'react-native';
import { IStack } from 'screen-props';
import { _t } from '@i18n';
import { assets } from '@assets';
import { colors, constants, variants } from '@values';
import { PopupPrototype } from '@utils';
import { routes } from '@navigator/routes';
import { UIKit } from '@uikit';
import Header from '@containers/header';

interface Props extends IStack {}
const defaultUri = 'https://remitano.com/btc/vn';

const ListPost = memo((props: Props) => {
  const webviewRef = useRef<WebView>() as MutableRefObject<WebView>;
  const inputRef = useRef<TextInput>() as MutableRefObject<TextInput>;

  const [refreshing, setRefreshing] = useState(false);
  const [uriSearch, setUriSearch] = useState(defaultUri);
  const [uri, setUri] = useState(defaultUri);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

  useEffect(() => {
    props.navigation.setOptions({
      header: (p) => <Header {...p} />,
    });
  }, [props.navigation]);

  const onSubmitEditing = useCallback(() => {
    if (uriSearch) {
      const enhance = uriSearch.startsWith('http')
        ? uriSearch
        : `http://${uriSearch}`;

      setUri(enhance);
    }
  }, [uriSearch]);

  const onPress = useCallback(() => {
    // PopupPrototype.showProtectedOverlay();
    // props.navigation.navigate(routes.webview);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    webviewRef.current?.reload();
  }, [webviewRef.current]);

  const onLoadStart = useCallback(() => {
    // PopupPrototype.showProtectedOverlay();
  }, []);

  const onLoadEnd = useCallback(() => {
    setRefreshing(false);
  }, []);

  const renderLoading = useCallback(() => {
    return <View />;
  }, []);

  const renderError = useCallback(
    (errorDomain: string | undefined, errorCode: number, errorDesc: string) => {
      if (!errorDomain && !errorCode && !errorDesc) {
        return <View />;
      }
      return (
        <View style={styles.emptyWrapper}>
          <Image source={assets.icon.ic_empty} style={styles.empty} />
          <Text>{_t('emptyContent')}</Text>
        </View>
      );
    },
    [],
  );

  const onNavigationStateChange = useCallback((e: WebViewNavigation) => {
    setCanGoBack(e.canGoBack);
    setCanGoForward(e.canGoForward);
    setUriSearch(e.url);
  }, []);

  const onClear = useCallback(() => {
    setUriSearch('');
    inputRef.current?.focus();
  }, []);

  const onBack = useCallback(() => {
    webviewRef.current?.goBack();
  }, [webviewRef.current]);

  const omnForward = useCallback(() => {
    webviewRef.current?.goForward();
  }, [webviewRef.current]);

  return (
    <UIKit.View style={styles.container}>
      {/* <Header {...props} /> */}
      <UIKit.Button
        title="next"
        onPress={() => {
          props.navigation.navigate(routes.productDetail);
        }}
      />
    </UIKit.View>
  );
});

export default ListPost;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  webview: {
    flexGrow: -1,
    flex: 0,
  },
  emptyWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  empty: {
    width: 100,
    height: 100,
    tintColor: colors.gray,
  },
  headerWrapper: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.silver,
    justifyContent: 'flex-end',
    backgroundColor: colors.white,
    paddingBottom: constants.halfPadding,
    paddingHorizontal: constants.dfPadding,
    paddingTop: constants.isAndroid
      ? constants.halfPadding
      : constants.statusBarHeight,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backWrapper: {
    marginRight: constants.halfPadding,
  },
  iconBack: {
    width: 20,
    height: 20,
    tintColor: colors.black,
  },
  iconForward: {
    transform: [
      {
        rotateZ: '180deg',
      },
    ],
  },
  disabled: {
    tintColor: colors.silver,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 2,
    borderColor: colors.silver,
    paddingHorizontal: constants.halfPadding,
  },
  input: {
    flex: 1,
    paddingVertical: constants.halfPadding,
    color: colors.gray,
    height: 40,
    marginHorizontal: constants.halfPadding,
  },
  iconSearch: {
    width: variants.h4,
    height: variants.h4,
    tintColor: colors.silver,
  },
  closeWrapper: {
    backgroundColor: colors.gray,
  },
  iconClose: {
    width: variants.h3,
    height: variants.h3,
    tintColor: colors.silver,
  },
});
