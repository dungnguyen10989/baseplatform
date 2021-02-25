import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import {
  CardStyleInterpolators,
  createStackNavigator,
  StackCardInterpolationProps,
} from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { containerNav } from './helper';
import { routes } from './routes';
import { colors, constants } from '@values';
import { assets } from '@assets';
import { UIKit } from '@uikit';
import { _t } from '@i18n';

import { Overlay } from '@containers/_nav';
import Login from '@containers/auth/login';
import Register from '@containers/auth/register';
import ForgotPassword from '@containers/auth/forgotPsw';
import OTP from '@containers/auth/otp';
import VerifyPsw from '@containers/auth/verifyPsw';
import ProductDetail from '@containers/productDetail';
import PromoDetail from '@containers/promoDetail';
import Webview from '@containers/webview';
import CustomHeader from '@containers/header';
import QR from '@containers/qr';
import Homepage from '@containers/tabs/homepage';
import Product from '@containers/tabs/product';
import Promotion from '@containers/tabs/promotion';
import Customers from '@containers/tabs/customers';
import PostRedeemBonusPoint from '@containers/postRedeemBonusPoint';
import PushNotification from '@containers/pushNotification';
import CustomerDetail from '@containers/customerDetail';

const Stack = createStackNavigator();
const Tabs = createBottomTabNavigator();

const navStyles = StyleSheet.create({
  backIcon: {
    width: 20,
    height: 20,
    marginHorizontal: constants.halfPadding,
  },
  tabIcon: {
    width: 24,
    height: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: constants.halfPadding,
  },
  header: { backgroundColor: '#dfe6e9' },
});

export const headerBackImage = ({ tintColor }: { tintColor: string }) => (
  <UIKit.FastImage
    source={assets.icon.ic_back}
    tintColor={tintColor}
    style={navStyles.backIcon}
  />
);

const commonModalOptions = {
  cardStyleInterpolator: (props: StackCardInterpolationProps) => ({
    cardStyle: {
      opacity: props.current.progress.interpolate({
        inputRange: [0, 0.5, 0.9, 1],
        outputRange: [0, 0.25, 0.7, 1],
      }),
    },
    overlayStyle: {
      opacity: props.current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.5],
        extrapolate: 'clamp',
      }),
    },
  }),
  gestureEnabled: false,
  cardOverlayEnabled: true,
  cardStyle: {
    backgroundColor: 'transparent',
  },
};

const RootAuth = memo(() => {
  return (
    <Stack.Navigator
      headerMode="none"
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.skyBlue,
        },
        headerBackImage,
        headerTintColor: colors.white,
        headerBackTitleVisible: false,
        cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
      }}>
      <Stack.Screen name={routes.login} component={Login} />
      <Stack.Screen name={routes.register} component={Register} />
      <Stack.Screen name={routes.forgotPassword} component={ForgotPassword} />
      <Stack.Screen name={routes.otp} component={OTP} />
      <Stack.Screen name={routes.verifyPassword} component={VerifyPsw} />
      <Stack.Screen
        name={routes.webview}
        component={Webview}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
        }}
      />
    </Stack.Navigator>
  );
});

const TabsScreen = memo(() => {
  const resources = [
    {
      name: routes.tab0,
      component: Homepage,
      icon: assets.icon.tab_0,
      label: _t('_nav.tab0'),
    },
    {
      name: routes.tab1,
      component: Product,
      icon: assets.icon.tab_1,
      label: _t('_nav.tab1'),
    },
    {
      name: routes.tab2,
      component: Promotion,
      icon: assets.icon.tab_2,
      label: _t('_nav.tab2'),
    },
    {
      name: routes.tab3,
      component: Customers,
      icon: assets.icon.tab_3,
      label: _t('_nav.tab3'),
    },
  ];
  return (
    <Tabs.Navigator
      initialRouteName={routes.tab1}
      tabBarOptions={{
        activeTintColor: colors.textColor,
        inactiveTintColor: colors.gray,
      }}>
      {resources.map((item) => (
        <Tabs.Screen
          key={item.name}
          name={item.name}
          component={item.component}
          options={{
            tabBarIcon: (p: any) => (
              <UIKit.Image
                source={item.icon}
                tintColor={p.color}
                style={navStyles.tabIcon}
              />
            ),
            tabBarLabel: item.label,
          }}
        />
      ))}
    </Tabs.Navigator>
  );
});

const RootTabs = memo(() => {
  return (
    <Stack.Navigator
      headerMode="screen"
      screenOptions={(p: any) => ({
        headerTintColor: colors.textColor,
        headerBackTitleVisible: false,
        // headerTitleAllowFontScaling: true,
        headerBackImage,
        headerTitleStyle: navStyles.title,
        headerTitle: p.route.params?.title || _t(`_nav.${p.route.name}`),
        headerStyle: navStyles.header,
      })}>
      <Stack.Screen
        name={routes.tabsScreen}
        component={TabsScreen}
        options={{
          header: (p) => <CustomHeader {...p} />,
        }}
      />
      <Stack.Screen
        name={routes.webview}
        component={Webview}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
        }}
      />
      <Stack.Screen name={routes.productDetail} component={ProductDetail} />
      <Stack.Screen name={routes.promoDetail} component={PromoDetail} />
      <Stack.Screen
        name={routes.pushNotification}
        component={PushNotification}
      />
      <Stack.Screen
        name={routes.postRedeemBonusPoint}
        component={PostRedeemBonusPoint}
      />

      <Stack.Screen name={routes.qr} component={QR} />
      <Stack.Screen name={routes.customerDetail} component={CustomerDetail} />
    </Stack.Navigator>
  );
});

export default memo(() => {
  return (
    <SafeAreaProvider>
      <NavigationContainer ref={containerNav}>
        <Stack.Navigator
          headerMode="none"
          mode="modal"
          screenOptions={commonModalOptions}>
          <Stack.Screen name={routes._authStack} component={RootAuth} />
          <Stack.Screen name={routes._rootTabs} component={RootTabs} />
          <Stack.Screen name={routes._overlay} component={Overlay} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
});
