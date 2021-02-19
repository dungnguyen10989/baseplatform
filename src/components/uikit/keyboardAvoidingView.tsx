import { constants } from '@values';
import React, { ComponentType, memo, PropsWithChildren } from 'react';
import { KeyboardAvoidingView } from 'react-native';
import commonStyles from './styles';

interface IKeyboardAvoidingViewProps extends PropsWithChildren<any> {
  keyboardVerticalOffset?: number;
}

const FuncComponent = memo((props: IKeyboardAvoidingViewProps) => {
  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={props.keyboardVerticalOffset || 0}
      behavior="padding"
      style={commonStyles.flex1}>
      {props.children}
    </KeyboardAvoidingView>
  );
});

(FuncComponent as ComponentType<IKeyboardAvoidingViewProps>).defaultProps = {
  keyboardVerticalOffset: constants.isAndroid
    ? 61
    : constants.isIphoneX
    ? 93
    : 69,
};

export default FuncComponent;
