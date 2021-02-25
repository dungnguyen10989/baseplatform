import React, {
  ComponentType,
  forwardRef,
  memo,
  PropsWithChildren,
  useMemo,
} from 'react';
import {
  KeyboardAwareScrollView,
  KeyboardAwareScrollViewProps,
} from 'react-native-keyboard-aware-scroll-view';

import { generateStyle, IContainerProps } from './container';

type IKeyboardAwareScrollViewProps = PropsWithChildren<
  Partial<KeyboardAwareScrollViewProps> & IContainerProps & {}
>;

const FuncComponent = forwardRef<
  KeyboardAwareScrollView,
  IKeyboardAwareScrollViewProps
>((props, ref) => {
  const { padding, paddingH, paddingV, color, style, safe, ...rest } = props;
  const _style = useMemo(() => generateStyle(props), [props]);

  return <KeyboardAwareScrollView {...rest} ref={ref} style={_style} />;
});

export const defaultKeyboardAwareProps: KeyboardAwareScrollViewProps = {
  enableAutomaticScroll: true,
  enableResetScrollToCoords: true,
  keyboardOpeningTime: 0,
  enableOnAndroid: true,
  keyboardShouldPersistTaps: 'handled',
  showsVerticalScrollIndicator: false,
  showsHorizontalScrollIndicator: false,
  keyboardDismissMode: 'interactive',
};

(FuncComponent as ComponentType<IKeyboardAwareScrollViewProps>).defaultProps = {
  ...defaultKeyboardAwareProps,
};

export default memo(FuncComponent);
