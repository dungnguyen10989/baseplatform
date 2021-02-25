import React, {
  forwardRef,
  memo,
  MutableRefObject,
  useMemo,
  useCallback,
  RefObject,
  ComponentType,
} from 'react';
import {
  TextInput,
  TextInputProps,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
} from 'react-native';
import {
  IModifiersSpacing,
  IModifiersStyling,
  IModifiersText,
  IModifiersLayout,
  IModifiersTest,
} from 'custom-ui-kit';
import { colors, constants } from '@values';
import { destructPropsToStyle } from './helper';

interface Props {
  borderWidth?: number;
  borderColor?: string;
  nextRef?: RefObject<TextInput> | MutableRefObject<TextInput>;
}

export interface ITextFieldProps
  extends TextInputProps,
    IModifiersSpacing,
    IModifiersStyling,
    IModifiersText,
    IModifiersLayout,
    IModifiersTest,
    Props {}

const TextField = memo(
  forwardRef<TextInput, ITextFieldProps>((props, ref) => {
    const { _styles, _props } = useMemo(
      () => destructPropsToStyle<Props & TextInputProps>(props),
      [props],
    );
    const {
      borderWidth,
      borderColor,
      nextRef,
      returnKeyType,
      value,
      onSubmitEditing,
      ...rest
    } = _props;

    const borderStyle = {
      borderBottomWidth: borderWidth,
      borderBottomColor: borderColor,
    };

    const _onSubmitEditing = useCallback(
      (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
        nextRef?.current?.focus();
        onSubmitEditing?.(e);
      },
      [nextRef, onSubmitEditing],
    );

    if (props.testID === '1') {
      console.log('style', _styles);
    }

    return (
      <TextInput
        {...rest}
        value={value ? `${value}` : ''}
        ref={ref}
        style={[
          _styles.textStyle,
          _styles.layoutStyle,
          _styles.spacingStyle,
          _styles.stylingStyle,
          borderStyle,
        ]}
        returnKeyType={nextRef && nextRef.current ? 'next' : returnKeyType}
        onSubmitEditing={_onSubmitEditing}
      />
    );
  }),
);

(TextField as ComponentType<ITextFieldProps>).defaultProps = {
  borderColor: colors.silver,
  borderWidth: 0,
  placeholderTextColor: colors.gray,
  clearButtonMode: 'while-editing',
  underlineColorAndroid: colors.transparent,
};

export default TextField;
