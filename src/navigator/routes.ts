const routes = {
  _mainStack: '',
  _rootStack: '',
  _authStack: '',
  _overlay: '',
  _dialog: '',
  _webviewStack: '',
  _rootTabs: '',
  tabsScreen: '',
  webview: '',
  otp: '',
  verifyPassword: '',
  tab0: '',
  tab1: '',
  tab2: '',
  tab3: '',
  main: '',
  login: '',
  register: '',
  forgotPassword: '',
  productDetail: '',
  promoDetail: '',
  qr: '',
  postRedeem: '',
  pushNotification: '',
  customerDetail: '',
  shopDetail: '',
};

for (const key in routes) {
  (routes as any)[key] = key;
}

export { routes };
