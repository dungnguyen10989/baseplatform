import { useHeaderHeight } from '@react-navigation/stack';
import { isNumber } from 'lodash';
import React, { memo, PropsWithChildren } from 'react';
import { KeyboardAvoidingView } from 'react-native';
import commonStyles from './styles';

interface IKeyboardAvoidingViewProps extends PropsWithChildren<any> {
  keyboardVerticalOffset?: number;
}

const FuncComponent = memo((props: IKeyboardAvoidingViewProps) => {
  const height = useHeaderHeight();
  const _offset = props.keyboardVerticalOffset;
  const offset = isNumber(_offset) ? _offset : height;
  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={offset}
      behavior="padding"
      style={commonStyles.flex1}>
      {props.children}
    </KeyboardAvoidingView>
  );
});

export default FuncComponent;
