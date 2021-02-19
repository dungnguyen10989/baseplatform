import React from 'react';
import {
  View,
  StyleSheet,
  ViewProps,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {
  IModifiersSpacing,
  IModifiersStyling,
  IModifiersLayout,
  IModifiersTest,
} from 'custom-ui-kit';
import { destructPropsToStyle } from './helper';

export interface IViewProps
  extends React.PropsWithChildren<ViewProps>,
    IModifiersSpacing,
    IModifiersStyling,
    IModifiersLayout,
    IModifiersTest {}

interface State {
  innerProps: ViewProps;
  innerStyle: StyleProp<ViewStyle>;
}

export default class CustomView extends React.PureComponent<IViewProps, State> {
  constructor(props: IViewProps) {
    super(props);
    this.state = {
      innerProps: {},
      innerStyle: {},
    };
  }

  static getDerivedStateFromProps(props: IViewProps, _: State) {
    const { style, ...rest } = props;
    const { _styles, _props } = destructPropsToStyle(rest);
    const mergeStyles = StyleSheet.flatten([
      style,
      _styles.layoutStyle,
      _styles.spacingStyle,
      _styles.stylingStyle,
    ]);
    return {
      innerProps: _props,
      innerStyle: mergeStyles,
    };
  }

  render() {
    return <View {...this.state.innerProps} style={this.state.innerStyle} />;
  }
}
