import React, {
  useState,
  MutableRefObject,
  useCallback,
  memo,
  useRef,
} from 'react';
import { WebView, WebViewNavigation } from 'react-native-webview';
import {
  ScrollView,
  RefreshControl,
  StyleSheet,
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { IStack } from 'screen-props';
import { _mBaseSchema, _mFeatureSchema, _mPostSchema } from '@database/schemas';
import { _t } from '@i18n';
import { assets } from '@assets';
import { colors, dims, variants } from '@values';
import { PopupManager } from '@utils/popup';

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

  const onSubmitEditing = useCallback(() => {
    if (uriSearch) {
      const enhance = uriSearch.startsWith('http')
        ? uriSearch
        : `http://${uriSearch}`;

      setUri(enhance);
    }
  }, [uriSearch]);

  const onChangeText = useCallback((text: string) => {
    setUriSearch(text);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    webviewRef.current?.reload();
  }, [webviewRef.current]);

  const onLoadStart = useCallback(() => {
    // PopupManager.showProtectedOverlay();
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
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.backWrapper}
            onPress={onBack}
            disabled={!canGoBack}>
            <Image
              source={assets.icon.ic_back}
              style={[
                styles.iconBack,
                !canGoBack ? styles.disabled : undefined,
              ]}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backWrapper}
            onPress={omnForward}
            disabled={!canGoForward}>
            <Image
              source={assets.icon.ic_back}
              style={[
                styles.iconBack,
                styles.iconForward,
                !canGoForward ? styles.disabled : undefined,
              ]}
            />
          </TouchableOpacity>

          <View style={styles.inputContainer}>
            <Image source={assets.icon.ic_search} style={styles.iconSearch} />

            <TextInput
              ref={inputRef}
              style={styles.input}
              value={uriSearch}
              onChangeText={onChangeText}
              returnKeyType="go"
              autoCapitalize="none"
              autoCorrect={false}
              blurOnSubmit
              keyboardType="url"
              clearButtonMode="never"
              placeholder={_t('enterAddress')}
              onSubmitEditing={onSubmitEditing}
              selectTextOnFocus
            />

            {uriSearch ? (
              <TouchableOpacity onPress={onClear}>
                <Image source={assets.icon.ic_close} style={styles.iconClose} />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <WebView
          ref={webviewRef}
          source={{ uri }}
          onLoadStart={onLoadStart}
          onLoadEnd={onLoadEnd}
          renderLoading={renderLoading}
          renderError={renderError}
          style={styles.webview}
          onNavigationStateChange={onNavigationStateChange}
        />
      </ScrollView>
    </View>
  );
});

export default ListPost;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    paddingBottom: dims.halfPadding,
    paddingHorizontal: dims.dfPadding,
    paddingTop: dims.isAndroid ? dims.halfPadding : dims.statusBarHeight,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backWrapper: {
    marginRight: dims.halfPadding,
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
    paddingHorizontal: dims.halfPadding,
  },
  input: {
    flex: 1,
    paddingVertical: dims.halfPadding,
    color: colors.gray,
    height: 40,
    marginHorizontal: dims.halfPadding,
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
