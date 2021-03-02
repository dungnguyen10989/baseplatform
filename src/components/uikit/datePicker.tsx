import React, { ComponentType, PureComponent } from 'react';
import {
  Platform,
  View,
  StyleSheet,
  Modal,
  StyleProp,
  TextStyle,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import DateTimePicker, {
  IOSNativeProps,
  AndroidNativeProps,
} from '@react-native-community/datetimepicker';
import moment from 'moment';
import Touchable from './touchable';
import Text from './text';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { variants, colors, constants } from '@values';
import { _t } from '@i18n';

type DatePickerProps = Omit<IOSNativeProps, 'value'> &
  Omit<AndroidNativeProps, 'value'>;

export interface IDatePickerProps extends DatePickerProps {
  caretSize?: number;
  iconStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
}

interface State {
  visible?: boolean;
}

export default class DatePicker extends PureComponent<IDatePickerProps, State> {
  constructor(props: IDatePickerProps) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  onChange = (e: any, date: Date | undefined) => {
    this.props.onChange?.(e, date);
    this.setState({ visible: false });
  };

  renderPicker = () => {
    return (
      <DateTimePicker
        {...this.props}
        onChange={this.onChange}
        style={undefined}
        value={this.props.date || new Date()}
        locale="vi-VN"
        display="inline"
      />
    );
  };

  openPicker = () => {
    this.setState({ visible: true });
    Keyboard.dismiss();
  };
  closePicker = () => this.setState({ visible: false });

  generateText = () => {
    if (!this.props.date) {
      return '';
    }
    try {
      return moment(this.props.date)?.format('DD-MM-YYYY');
    } catch (error) {
      return '';
    }
  };

  render() {
    const { iconStyle, labelStyle, style } = this.props;
    return (
      <View style={style}>
        <Touchable onPress={this.openPicker} style={styles.wrapper}>
          <FontAwesome name="calendar" style={[styles.calendar, iconStyle]} />
          <Text style={[styles.text, labelStyle]}>{this.generateText()}</Text>
        </Touchable>

        {Platform.OS === 'ios' ? (
          <Modal visible={this.state.visible} transparent animationType="fade">
            <TouchableWithoutFeedback onPress={this.closePicker}>
              <View style={styles.modal}>
                <View style={styles.content}>{this.renderPicker()}</View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        ) : (
          this.renderPicker()
        )}
      </View>
    );
  }
}

(DatePicker as ComponentType<IDatePickerProps>).defaultProps = {
  caretSize: variants.normal,
};

export const styles = StyleSheet.create({
  modal: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
  },
  content: {
    padding: constants.halfPadding,
    margin: constants.dfPadding,
    backgroundColor: colors.white,
    borderRadius: 2,
  },
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    marginHorizontal: constants.halfPadding,
  },
  calendar: {
    fontSize: variants.h4,
    color: colors.primaryBlue,
  },
});
