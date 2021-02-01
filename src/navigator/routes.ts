const ROUTES = {
  _mainStack: '',
  _overlay: '',
  _dialog: '',
  main: '',
};

for (const key in ROUTES) {
  (ROUTES as any)[key] = key;
}

export { ROUTES };
