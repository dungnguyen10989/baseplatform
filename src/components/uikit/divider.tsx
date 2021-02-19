import React, { ComponentType, memo } from 'react';
import { ViewStyle, StyleProp, View } from 'react-native';
import { IModifiersTest } from 'custom-ui-kit';

import { constants } from '@values';

export type IThickness = 'hairline' | number;

interface IDividerProps extends IModifiersTest {
  color?: string;
  thickness?: IThickness;
  style?: StyleProp<ViewStyle>;
  column?: boolean;
}

const FuncComponent = (props: IDividerProps) => {
  const { color, thickness, style, column } = props;
  const w = thickness === 'hairline' || !thickness ? constants.line : thickness;
  const _style = column
    ? { width: w, height: '100%', backgroundColor: color }
    : { height: w, width: '100%', backgroundColor: color };

  return <View style={[style, _style]} />;
};

(FuncComponent as ComponentType<IDividerProps>).defaultProps = {
  color: 'rgba(0,0,0,0.2)',
  thickness: 'hairline',
};

export default memo(FuncComponent);
export const renderDivider = () => <FuncComponent />;
