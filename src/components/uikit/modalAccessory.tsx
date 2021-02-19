import React, { ComponentType, memo } from 'react';
import {
  StyleSheet,
  StyleProp,
  TextStyle,
  GestureResponderEvent,
  ViewStyle,
  View,
} from 'react-native';

import { colors, variants } from '@values';
import Chevron from './chevron';
import commonStyles from './styles';

export interface IModalAccessoryProps {
  style?: StyleProp<ViewStyle>;
  doneText?: string;
  doneStyle?: StyleProp<TextStyle>;
  withCaret?: boolean;

  onUpArrow?: (e: GestureResponderEvent) => void;
  onDownArrow?: (e: GestureResponderEvent) => void;
  onDone?: (e: GestureResponderEvent) => void;
}

const size = 15;
const thickness = 1.5;

const FuncComponent = (props: IModalAccessoryProps) => {
  const {
    doneText,
    doneStyle,
    onUpArrow,
    onDownArrow,
    onDone,
    style,
    withCaret,
  } = props;

  return (
    <View style={[defaultStyles.modalViewMiddle, style]}>
      {withCaret ? (
        <View style={defaultStyles.chevW}>
          <Chevron
            size={size}
            thickness={thickness}
            direction="up"
            onPress={onUpArrow}
            color={onUpArrow ? colors.button : colors.gray}
            style={defaultStyles.chevronUp}
          />
          <Chevron
            size={size}
            thickness={thickness}
            direction="down"
            onPress={onUpArrow}
            color={onDownArrow ? colors.button : colors.gray}
            style={defaultStyles.chevronDown}
          />
        </View>
      ) : (
        <View style={commonStyles.flex1} />
      )}
      {/* <TouchableOpacity onPress={onDone} hitSlop={DIMS.hitSlop}>
        <Text style={[defaultStyles.done, doneStyle]}>{i18n.t('done')}</Text>
      </TouchableOpacity> */}
    </View>
  );
};

(FuncComponent as ComponentType<IModalAccessoryProps>).defaultProps = {
  doneText: 'Done',
  withCaret: true,
  onDone: () => {},
};

export default memo(FuncComponent);

const defaultStyles = StyleSheet.create({
  modalViewMiddle: {
    height: 44,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: colors.white2,
    borderTopWidth: 0.5,
    borderTopColor: colors.black1,
  },
  chevW: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chevronUp: {
    marginLeft: 11,
    transform: [{ translateY: 4 }],
  },
  chevronDown: {
    marginLeft: 18,
    transform: [{ translateY: -5 }],
  },
  chevronActive: {
    borderColor: colors.button,
  },
  done: {
    color: colors.button,
    fontWeight: 'bold',
    fontSize: variants.h4,
    paddingTop: 1,
    paddingRight: 2,
  },
});
