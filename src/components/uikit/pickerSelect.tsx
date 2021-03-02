import React, {
  ComponentType,
  createRef,
  PropsWithChildren,
  PureComponent,
  RefObject,
} from 'react';
import {
  Keyboard,
  Platform,
  View,
  StyleSheet,
  StyleProp,
  TextStyle,
} from 'react-native';
import { Modalize } from 'react-native-modalize';
import commonStyles from './styles';
import Text from './text';
import Touchable from './touchable';

import { Picker } from '@react-native-picker/picker';
import {
  PickerProps,
  PickerItemProps,
  ItemValue,
} from '@react-native-picker/picker/typings/Picker';
import { isEqual } from 'lodash';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { variants, colors } from '@values';
import { _t } from '@i18n';

export interface IPickerSelectProps
  extends Partial<PickerProps>,
    PropsWithChildren<{
      items: PickerItemProps[];
      value?: any;
      itemKey?: string;
      caretSize?: number;
      labelStyle?: StyleProp<TextStyle>;
      labelContainerStyle?: StyleProp<TextStyle>;
    }> {}

interface State {
  selectedItem?: PickerItemProps;
  visible?: boolean;
}

const destructProps = (props: IPickerSelectProps) => {
  const {
    items,
    value,
    itemKey,
    caretSize,
    labelStyle,
    labelContainerStyle,
    ...rest
  } = props;

  return {
    custom: {
      items,
      value,
      itemKey,
      labelStyle,
      labelContainerStyle,
    },
    native: { ...rest },
  };
};

export default class PickerSelect extends PureComponent<
  IPickerSelectProps,
  State
> {
  modalRef: RefObject<Modalize>;

  constructor(props: IPickerSelectProps) {
    super(props);

    const { selectedItem } = PickerSelect.getSelectedItem({
      items: props.items,
      value: props.value,
    });

    this.modalRef = createRef<Modalize>();
    this.state = {
      selectedItem,
      visible: false,
    };
    this.onValueChange = this.onValueChange.bind(this);
    this.togglePicker = this.togglePicker.bind(this);
  }

  static getSelectedItem(params: { items: PickerItemProps[]; value: any }) {
    const { items, value } = params;
    let idx = items.findIndex((item) => {
      return isEqual(item.value, value);
    });

    return {
      selectedItem: items[idx] || {},
      idx,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps: IPickerSelectProps) {
    if (
      !isEqual(nextProps.items, this.props.items) ||
      !isEqual(nextProps.value, this.props.value)
    ) {
      const { selectedItem } = PickerSelect.getSelectedItem({
        items: nextProps.items,
        value: nextProps.value,
      });
      this.setState({ selectedItem });
    }
  }

  componentDidUpdate(prevProps: IPickerSelectProps, prevState: State) {
    if (prevState.visible !== this.state.visible && this.modalRef.current) {
      this.state.visible
        ? this.modalRef.current.open()
        : this.modalRef.current.close();
    }
  }

  getValue = () => this.state.selectedItem;

  onValueChange = (value: any, index: number) => {
    const { onValueChange } = this.props;
    onValueChange && onValueChange(value, index);
    this.setState({ selectedItem: this.props.items[index] });
  };

  onDone = () => {
    const { items, onValueChange } = this.props;
    const { selectedItem } = this.state;
    const result = selectedItem?.value ? selectedItem : items[0];

    const index = items.findIndex((i) => i.value === result.value);
    this.setState({ selectedItem: result });
    onValueChange?.(result.value as ItemValue, index);
    this.togglePicker();
  };

  togglePicker = async () => {
    const { enabled } = this.props;
    const { visible } = this.state;

    if (!enabled) {
      return;
    }

    if (!visible) {
      Keyboard.dismiss();
    }
    await this.setState({ visible: !this.state.visible });
  };

  renderPickerItems = () =>
    this.props.items.map((item: PickerItemProps, index: number) => (
      <Picker.Item
        key={`key.${index}`}
        label={item.label}
        value={item.value}
        color={item.color}
      />
    ));

  openPicker = () => this.modalRef.current?.open();

  renderIOSPicker() {
    const { native, custom } = destructProps(this.props);
    const { selectedItem } = this.state;

    return (
      <View style={styles.viewContainer}>
        <Touchable onPress={this.openPicker}>
          <View
            pointerEvents="box-only"
            style={[custom.labelContainerStyle, styles.labelContainer]}>
            <Text style={[custom.labelStyle, commonStyles.flex1]}>
              {selectedItem?.label}
            </Text>
            <FontAwesome name="caret-down" size={this.props.caretSize} />
          </View>
        </Touchable>

        <Modalize
          ref={this.modalRef}
          adjustToContentHeight
          closeOnOverlayTap
          handlePosition="inside"
          useNativeDriver
          withOverlay
          withHandle
          threshold={100}
          withReactModal>
          <Picker
            {...native}
            onValueChange={this.onValueChange}
            selectedValue={selectedItem?.value}
            style={[styles.picker, native.style]}>
            {this.renderPickerItems()}
          </Picker>
        </Modalize>
      </View>
    );
  }

  renderAndroidPicker() {
    const { native } = destructProps(this.props);
    const { selectedItem } = this.state;

    return (
      <View style={styles.viewContainer}>
        <Picker
          {...native}
          onValueChange={this.onValueChange}
          selectedValue={selectedItem?.value}>
          {this.renderPickerItems()}
        </Picker>
      </View>
    );
  }

  render() {
    return Platform.OS === 'ios'
      ? this.renderIOSPicker()
      : this.renderAndroidPicker();
  }
}

(PickerSelect as ComponentType<IPickerSelectProps>).defaultProps = {
  value: undefined,
  enabled: true,
  itemKey: undefined,
  children: undefined,
  mode: 'dropdown',
  caretSize: variants.normal,
};

export const styles = StyleSheet.create({
  viewContainer: {
    alignSelf: 'stretch',
  },
  modal: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  picker: {
    backgroundColor: colors.white,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
