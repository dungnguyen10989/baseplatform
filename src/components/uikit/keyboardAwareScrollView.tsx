import React, { ComponentType, memo, PropsWithChildren } from 'react';
import {
  KeyboardAwareScrollView,
  KeyboardAwareScrollViewProps,
} from 'react-native-keyboard-aware-scroll-view';
import { IModifiersSpacing } from 'custom-ui-kit';

type IKeyboardAwareScrollViewProps = PropsWithChildren<
  Partial<KeyboardAwareScrollViewProps> & IModifiersSpacing & {}
>;

const FuncComponent = (props: IKeyboardAwareScrollViewProps) => {
  return <KeyboardAwareScrollView {...props} />;
};

export const defaultKeyboardAwareProps: KeyboardAwareScrollViewProps = {
  enableAutomaticScroll: true,
  enableResetScrollToCoords: true,
  keyboardOpeningTime: 0,
  enableOnAndroid: true,
  keyboardShouldPersistTaps: 'handled',
  showsVerticalScrollIndicator: false,
  showsHorizontalScrollIndicator: false,
  extraHeight: 200,
  keyboardDismissMode: 'interactive',
};

(FuncComponent as ComponentType<IKeyboardAwareScrollViewProps>).defaultProps = {
  ...defaultKeyboardAwareProps,
};

export default memo(FuncComponent);
