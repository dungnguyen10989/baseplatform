import React, {
  ComponentType,
  createRef,
  MutableRefObject,
  PropsWithChildren,
  PureComponent,
  RefObject,
} from 'react';
import {
  Keyboard,
  Modal,
  Platform,
  TouchableOpacity,
  View,
  StyleSheet,
  NativeSyntheticEvent,
  ModalProps,
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
      doneText?: string;
      doneStyle?: StyleProp<TextStyle>;
      onDonePress?: () => void;
      onUpArrow?: () => void;
      onDownArrow?: () => void;
      onOpen?: () => void;
      onClose?: () => void;
      modalProps?: Partial<ModalProps>;
      caretSize?: number;
      labelStyle?: StyleProp<TextStyle>;
      labelContainerStyle?: StyleProp<TextStyle>;
    }> {}

interface State {
  selectedItem?: PickerItemProps;
  showPicker?: boolean;
  orientation: 'portrait' | 'landscape';
}

const destructProps = (props: IPickerSelectProps) => {
  const {
    items,
    value,
    itemKey,
    doneText,
    onDonePress,
    onUpArrow,
    onDownArrow,
    onOpen,
    onClose,
    modalProps,
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
      doneText,
      onDonePress,
      onUpArrow,
      onDownArrow,
      onOpen,
      onClose,
      modalProps,
      caretSize,
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
  static getSelectedItem(params: { items: PickerItemProps[]; value: any }) {
    const { items, value } = params;
    let idx = items.findIndex((item) => {
      return isEqual(item.value, value);
    });

    if (idx === -1) {
      idx = 0;
    }
    return {
      selectedItem: items[idx] || {},
      idx,
    };
  }

  modalRef: RefObject<Modalize>;

  constructor(props: IPickerSelectProps) {
    super(props);

    const { selectedItem } = PickerSelect.getSelectedItem({
      items: this.props.items,
      value: props.value,
    });

    this.modalRef = createRef<Modalize>();
    this.state = {
      selectedItem,
      showPicker: false,
      orientation: 'portrait',
    };
    this.onValueChange = this.onValueChange.bind(this);
    this.onOrientationChange = this.onOrientationChange.bind(this);
    this.togglePicker = this.togglePicker.bind(this);
  }

  componentDidUpdate(prevProps: IPickerSelectProps, prevState: State) {
    if (
      prevState.showPicker !== this.state.showPicker &&
      this.modalRef.current
    ) {
      this.state.showPicker
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

  onOrientationChange(e: NativeSyntheticEvent<any>) {
    this.setState({
      orientation: e.nativeEvent.orientation,
    });
  }

  triggerOpenCloseCallbacks() {
    const { onOpen, onClose } = this.props;
    const { showPicker } = this.state;

    if (!showPicker && onOpen) {
      onOpen();
    }

    if (showPicker && onClose) {
      onClose();
    }
  }

  togglePicker = async (postToggleCallback?: () => void) => {
    const { enabled } = this.props;
    const { showPicker } = this.state;

    if (!enabled) {
      return;
    }

    if (!showPicker) {
      Keyboard.dismiss();
    }

    this.triggerOpenCloseCallbacks();
    await this.setState({ showPicker: !this.state.showPicker });
    postToggleCallback && postToggleCallback();
  };

  renderPickerItems = () =>
    this.props.items.map((item: any, index: number) => (
      <Picker.Item
        key={`key.${index}`}
        label={item.label}
        value={item.value}
        color={item.color}
      />
    ));

  onNext = () => {};

  renderIOSPicker() {
    const { native, custom } = destructProps(this.props);
    const { selectedItem, showPicker } = this.state;

    return (
      <View style={styles.viewContainer}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={this.togglePicker.bind(this, undefined)}>
          <View
            pointerEvents="box-only"
            style={[custom.labelContainerStyle, styles.labelContainer]}>
            <Text style={[custom.labelStyle, commonStyles.flex1]}>
              {selectedItem?.label}
            </Text>
            <FontAwesome name="caret-down" size={this.props.caretSize} />
          </View>
        </TouchableOpacity>

        <Modal
          visible={showPicker}
          transparent
          animationType="slide"
          supportedOrientations={['portrait', 'landscape']}
          onOrientationChange={this.onOrientationChange}
          {...custom.modalProps}>
          <View style={styles.modal}>
            <View style={styles.modalViewMiddle}>
              <TouchableOpacity
                // onPress={this.togglePicker.bind(this, undefined)}
                onPress={this.onDone}>
                <Text style={styles.done}>{_t('done').toLowerCase()}</Text>
              </TouchableOpacity>
            </View>
            <Picker
              onValueChange={this.onValueChange}
              selectedValue={
                selectedItem ? selectedItem.value : this.props.items[0].value
              }
              {...native}
              style={[styles.picker, native.style]}>
              {this.renderPickerItems()}
            </Picker>
          </View>
        </Modal>
      </View>
    );
  }

  renderAndroidPicker() {
    const { native } = destructProps(this.props);
    const { selectedItem } = this.state;

    return (
      <View style={styles.viewContainer}>
        <Picker
          onValueChange={this.onValueChange}
          selectedValue={selectedItem ? selectedItem.value : undefined}
          {...native}>
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
  doneText: 'Done',
  onDonePress: undefined,
  onUpArrow: undefined,
  onDownArrow: undefined,
  onOpen: undefined,
  onClose: undefined,
  modalProps: undefined,
  mode: 'dropdown',
  caretSize: variants.normal,
};

export const styles = StyleSheet.create({
  viewContainer: {
    alignSelf: 'stretch',
  },
  iconContainer: {
    position: 'absolute',
    right: 0,
  },
  modalViewTop: {
    flex: 1,
    // backgroundColor: colors.overlay,
  },
  modal: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  picker: {
    backgroundColor: colors.silver,
  },
  modalViewMiddle: {
    height: 44,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: colors.black333,
    zIndex: 2,
  },
  chevronContainer: {
    flexDirection: 'row',
  },
  chevron: {
    width: 15,
    height: 15,
    backgroundColor: colors.transparent,
    borderColor: colors.gray,
    borderTopWidth: 1.5,
    borderRightWidth: 1.5,
  },
  chevronUp: {
    marginLeft: 11,
    transform: [{ translateY: 4 }, { rotate: '-45deg' }],
  },
  chevronDown: {
    marginLeft: 22,
    transform: [{ translateY: -5 }, { rotate: '135deg' }],
  },
  chevronActive: {
    borderColor: colors.button,
  },
  done: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: variants.title,
  },
  modalViewBottom: {
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  placeholder: {
    color: colors.background,
  },
  headlessAndroidPicker: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    color: colors.transparent,
    opacity: 0,
  },
  caret: {
    width: variants.caption,
    height: variants.caption,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
