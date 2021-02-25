import React, { PureComponent } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  StyleProp,
  ViewStyle,
  View,
} from 'react-native';
import codePush from 'react-native-code-push';
import Error from './error';
import { ConsoleUtils } from '@utils/log';
import { constants } from '@values';
import { memoize } from 'lodash';

export interface IContainerProps {
  safe?: boolean;
  style?: StyleProp<ViewStyle>;
  padding?: boolean;
  paddingV?: boolean;
  paddingH?: boolean;
  color?: string;
}

interface State {
  error?: Error | undefined;
  errorInfo?: any;
}

export const generateStyle = memoize((props: IContainerProps) => {
  const { padding, paddingH, paddingV, color, style: _style } = props;
  const style: ViewStyle = StyleSheet.flatten([{}, _style]);
  if (padding) {
    style.padding = constants.dfPadding;
  }
  if (paddingH) {
    style.paddingHorizontal = constants.dfPadding;
  }
  if (paddingV) {
    style.paddingVertical = constants.dfPadding;
  }
  if (color) {
    style.backgroundColor = color;
  }

  return style;
});

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
    const { children, safe } = this.props;
    const style = generateStyle(this.props);

    const Wrapper = safe ? SafeAreaView : View;
    return (
      <Wrapper
        style={[styles.wrapper, style, error ? styles.center : undefined]}>
        {error ? <Error flex onReload={codePush.restartApp} /> : children}
      </Wrapper>
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
