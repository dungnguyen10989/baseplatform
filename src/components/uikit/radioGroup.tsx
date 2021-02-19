import React, { ComponentType, memo, PureComponent } from 'react';
import {
  StyleSheet,
  TextStyle,
  ViewStyle,
  ListRenderItemInfo,
  StyleProp,
  FlatListProps,
  TouchableOpacity,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { constants, colors, durations } from '@values';

import Text from './text';
import View from './view';
import FlatList from './flattList';
import Divider from './divider';

export interface Props<T> {
  label: string;
  data?: T;
}

interface IRadioButtonsProps<T> extends Partial<FlatListProps<Props<T>>> {
  data: Props<T>[];
  onChanged?: (index: number, data?: Props<T>) => void;
  initialIndex?: number;
  activeColor?: string;
  inactiveColor?: string;
  iconSize?: number;
  disabled?: boolean;
  labelStyle?: StyleProp<TextStyle>;
  itemStyle?: StyleProp<ViewStyle>;
  separatorStyle?: StyleProp<ViewStyle>;
  spacing?: number;
}

interface State {
  selected: number;
}

const size = 20;

const Icon = Animatable.createAnimatableComponent(Ionicons);

const RadioButton = memo(
  (props: { active?: boolean; color?: string; spacing?: number }) => {
    const { active, color } = props;
    return (
      <View marginR={props.spacing || 5}>
        <Icon
          size={size}
          color={color}
          name={`${constants.iconPrefix}radio-button-off`}
          duration={durations.short}
          animation={active ? 'fadeOut' : 'fadeIn'}
        />

        <Icon
          size={size}
          color={color}
          name={`${constants.iconPrefix}radio-button-on`}
          style={StyleSheet.absoluteFill}
          duration={durations.short}
          animation={active ? 'zoomIn' : 'zoomOut'}
        />
      </View>
    );
  },
);

export default class RadioGroup<T = any> extends PureComponent<
  IRadioButtonsProps<T>,
  State
> {
  constructor(props: IRadioButtonsProps<T>) {
    super(props);
    this.state = {
      selected: props.initialIndex || 0,
    };
  }

  public setSelected = (index: number, item?: Props<T>) =>
    this.onPress(index, item);

  public getSelected = () => ({
    index: this.state.selected,
    data: this.props.data[this.state.selected],
  });

  private onPress = async (index: number, item?: Props<T>) => {
    await this.setState({ selected: index });
    this.props.onChanged && this.props.onChanged(index, item);
  };

  private renderSeparator = () => {
    const style = [
      this.props.separatorStyle,
      { marginLeft: this.props.iconSize || size },
    ];
    return <Divider style={style} />;
  };

  private keyExtractor = (_: Props<T>, _index: number) => `key-${_index}`;

  private renderIRadioItem = (info: ListRenderItemInfo<Props<T>>) => {
    const { item, index } = info;
    const active = this.state.selected === index;
    const onItemPress = () => this.onPress(index, item);
    const len = this.props.data.length;
    return (
      <>
        <TouchableOpacity
          style={[styles.wrapper, this.props.itemStyle]}
          onPress={onItemPress}
          disabled={this.props.disabled}>
          <RadioButton
            active={active}
            color={active ? this.props.activeColor : this.props.inactiveColor}
            spacing={this.props.spacing}
          />

          <Text
            style={this.props.labelStyle}
            color={active ? this.props.activeColor : this.props.inactiveColor}>
            {item.label}
          </Text>
        </TouchableOpacity>
        {index < len - 1 ? this.renderSeparator() : null}
      </>
    );
  };

  render() {
    const { data } = this.props;

    return (
      <FlatList
        {...this.props}
        data={data}
        extraData={this.state}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        bounces={false}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderIRadioItem}
      />
    );
  }
}

(RadioGroup as ComponentType<IRadioButtonsProps<any>>).defaultProps = {
  activeColor: colors.textColor,
  inactiveColor: colors.grayBlur,
  horizontal: false,
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
});
