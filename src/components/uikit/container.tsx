import React, { PureComponent } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import codePush from 'react-native-code-push';
import { constants } from '@values';
import View, { IViewProps } from './view';
import KeyboardAvoidingView from './keyboardAvoidingView';
import Error from './error';
import { ConsoleUtils } from '@utils/log';

interface IContainerProps extends IViewProps {
  PADDING?: boolean;
  PADDING_V?: boolean;
  PADDING_H?: boolean;
  unSafe?: boolean;
  keyboardAvoidingView?: boolean;
}

interface State {
  error?: Error | undefined;
  errorInfo?: any;
}

export default class Container extends PureComponent<IContainerProps, State> {
  constructor(props: IContainerProps) {
    super(props);
    this.state = { error: undefined };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });

    ConsoleUtils.l('[JS-EXCEPTION]: ', error, errorInfo);
  }

  render() {
    const { error } = this.state;
    const {
      children,
      PADDING,
      PADDING_H,
      PADDING_V,
      padding,
      paddingV,
      paddingH,
      keyboardAvoidingView,
      style,
      ...rest
    } = this.props;

    const p = PADDING ? constants.dfPadding : padding;
    const pv = PADDING_V ? constants.dfPadding : paddingV;
    const ph = PADDING_H ? constants.dfPadding : paddingH;

    const content = this.props.unSafe ? (
      <View
        {...rest}
        style={[styles.wrapper, style, error ? styles.center : undefined]}
        padding={p}
        paddingH={ph}
        paddingV={pv}>
        {error ? <Error flex onReload={codePush.restartApp} /> : children}
      </View>
    ) : (
      <SafeAreaView style={styles.wrapper}>
        <View
          {...rest}
          style={[styles.wrapper, style, error ? styles.center : undefined]}
          padding={p}
          paddingH={ph}
          paddingV={pv}>
          {error ? <Error flex onReload={codePush.restartApp} /> : children}
        </View>
      </SafeAreaView>
    );

    return keyboardAvoidingView && constants.isIos ? (
      <KeyboardAvoidingView>{content}</KeyboardAvoidingView>
    ) : (
      content
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
