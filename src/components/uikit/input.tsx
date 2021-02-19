import React, {
  forwardRef,
  useState,
  memo,
  MutableRefObject,
  useMemo,
  useRef,
  useCallback,
  useEffect,
  RefObject,
  ComponentType,
} from 'react';
import {
  TouchableOpacity,
  TextInput,
  TextInputProps,
  StyleSheet,
  ViewStyle,
  StyleProp,
  TextInputFocusEventData,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  IModifiersSpacing,
  IModifiersStyling,
  IModifiersText,
  IModifiersLayout,
  IModifiersTest,
} from 'custom-ui-kit';
import { FormikProps } from 'formik';
import { isEqual } from 'lodash';
import { variants, colors, constants } from '@values';
import { destructPropsToStyle, useCombinedRefs } from './helper';
import View from './view';
import FormError from './formError';

const iconSize = variants.h4;
const iconW = iconSize * 1.4;
const additionalTimeFocusAndroid = 500;

interface Props {
  containerStyle?: StyleProp<ViewStyle>;
  borderWidth?: number;
  borderColor?: string;
  formID?: string;
  formProps?: FormikProps<any>;
  withError?: 'always' | 'when-has-error' | 'none';
  errorColor?: string;
  clearButtonColor?: string;
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

const TextField = forwardRef<TextInput, ITextFieldProps>((props, ref) => {
  const { _styles, _props } = useMemo(
    () => destructPropsToStyle<Props & TextInputProps>(props),
    [props],
  );

  const {
    containerStyle,
    borderWidth,
    borderColor,
    formID,
    formProps,
    withError,
    errorColor,
    clearButtonColor,
    nextRef,
    returnKeyType,
    clearButtonMode,
    autoFocus,
    value,
    onChangeText,
    onSubmitEditing,
    onFocus,
    onBlur,
    ...rest
  } = _props;

  const innerRef = useRef<TextInput>(); // create a new ref instance
  const combinedRef = useCombinedRefs<TextInput>(ref, innerRef); // pointed innerRef above to parent forwardRef to use ref

  useEffect(() => {
    let timeId: any;
    if (autoFocus && constants.isAndroid) {
      timeId = setTimeout(
        () => combinedRef.current && combinedRef.current.focus(),
        additionalTimeFocusAndroid,
      );
    }

    return () => clearTimeout(timeId);
  }, [autoFocus, combinedRef]);

  // local value for input
  const [localValue, setLocalValue] = useState(
    formID && formProps ? formProps.values[formID] : value,
  );

  useEffect(() => {
    if (!formID && !formProps) {
      setLocalValue(value);
    }
  }, [value]);

  const [visible, setVisible] = useState(
    clearButtonMode === 'always'
      ? Boolean(localValue)
      : clearButtonMode === 'never'
      ? false
      : clearButtonMode === 'while-editing'
      ? Boolean(autoFocus && localValue)
      : clearButtonMode === 'unless-editing'
      ? Boolean(!autoFocus && localValue)
      : false,
  );

  const error = formID && formProps ? formProps.errors[formID] : undefined;

  const borderStyle = {
    borderBottomWidth: borderWidth,
    borderBottomColor: borderColor,
  };

  const extraClearStyle = {
    paddingRight: visible ? iconW : _styles.textStyle.paddingRight,
  };

  const paddingV = {
    paddingVertical: _styles.textStyle.fontSize
      ? _styles.textStyle.fontSize / 3
      : variants.normal / 3,
  };

  // update parent form value and touched
  const updateFormProps = useCallback(
    (text: string) => {
      if (formProps && formID) {
        formProps.setFieldValue(formID, text, formProps.validateOnChange);
      }
    },
    [formID, formProps],
  );

  const onLocalChangeText = (text: string) => {
    setLocalValue(text);
    updateFormProps(text);
    onChangeText && onChangeText(text);
    setVisible(
      clearButtonMode === 'always' || clearButtonMode === 'while-editing'
        ? Boolean(text)
        : false,
    );
  };

  const _onSubmitEditing = useCallback(
    (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
      if (nextRef && nextRef.current) {
        nextRef.current.focus();
      }
      if (onSubmitEditing) {
        onSubmitEditing(e);
      }
    },
    [nextRef, onSubmitEditing],
  );

  const onLocalFocus = useCallback(
    (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      if (
        clearButtonMode === 'unless-editing' ||
        clearButtonMode === 'while-editing'
      ) {
        setVisible(
          clearButtonMode === 'while-editing' ? Boolean(localValue) : false,
        );
      }

      onFocus && onFocus(e);
      if (formID && formProps) {
        const { setFieldTouched, validateOnChange } = formProps;
        validateOnChange && setFieldTouched(formID, true);
      }
    },
    [clearButtonMode, formID, formProps, localValue, onFocus],
  );

  const onLocalBlur = useCallback(
    (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      if (
        clearButtonMode === 'unless-editing' ||
        clearButtonMode === 'while-editing'
      ) {
        setVisible(
          clearButtonMode === 'unless-editing' ? Boolean(localValue) : false,
        );
      }
      onBlur && onBlur(e);
      if (formID && formProps) {
        const {
          validateOnBlur,
          handleBlur,
          setFieldTouched,
          validateOnChange,
        } = formProps;
        validateOnBlur && handleBlur(formID)(e);
        validateOnChange && setFieldTouched(formID, undefined, validateOnBlur);
      }
    },
    [clearButtonMode, formID, formProps, localValue, onBlur],
  );

  const onClearPress = useCallback(async () => {
    setLocalValue('');
    updateFormProps('');
    combinedRef.current && combinedRef.current.focus();
    formID && formProps && formProps.setFieldTouched(formID, true, false);
  }, [combinedRef, formID, formProps, updateFormProps]);

  const renderClearButton = useMemo(() => {
    if (!visible) {
      return null;
    }

    return (
      <TouchableOpacity onPress={onClearPress} style={styles.clearButton}>
        <Ionicons
          name={`${constants.iconPrefix}close-circle`}
          color={clearButtonColor || colors.silver}
          size={iconSize}
        />
      </TouchableOpacity>
    );
  }, [clearButtonColor, onClearPress, visible]);

  return (
    <>
      <View
        style={[
          containerStyle,
          _styles.layoutStyle,
          _styles.spacingStyle,
          _styles.stylingStyle,
        ]}>
        <TextInput
          {...rest}
          autoFocus={autoFocus}
          value={localValue}
          onChangeText={onLocalChangeText}
          onFocus={onLocalFocus}
          onBlur={onLocalBlur}
          ref={combinedRef}
          style={[paddingV, _styles.textStyle, borderStyle, extraClearStyle]}
          clearButtonMode="never"
          returnKeyType={nextRef && nextRef.current ? 'next' : returnKeyType}
          onSubmitEditing={_onSubmitEditing}
        />
        {renderClearButton}
      </View>
      {withError && withError !== 'none' ? (
        <FormError
          message={error as string}
          color={error ? errorColor : colors.transparent}
        />
      ) : null}
    </>
  );
});

(TextField as ComponentType<ITextFieldProps>).defaultProps = {
  borderColor: colors.silver,
  borderWidth: StyleSheet.hairlineWidth,
  withError: 'none',
  errorColor: colors.error,
  placeholderTextColor: colors.gray,
  clearButtonMode: 'while-editing',
  paddingV: 0,
};

export default memo(
  TextField,
  (prev: ITextFieldProps, next: ITextFieldProps) => {
    const { formID, formProps: pProps } = prev;
    const { formProps: nProps } = next;
    if (!formID || !pProps || !nProps) {
      return false;
    }

    const { values: pValues, errors: pErrors } = pProps;
    const { values: nValues, errors: nErrors } = nProps;

    if (pProps.touched[formID] !== nProps.touched[formID]) {
      return false;
    }
    if (!nProps.touched[formID]) {
      return true;
    }
    if (!isEqual(pValues, nValues)) {
      return pValues[formID] === nValues[formID];
    }
    if (!isEqual(pErrors, nErrors)) {
      return pErrors[formID] === nErrors[formID];
    }
    return false;
  },
);

const styles = StyleSheet.create({
  clearButton: {
    width: iconW,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
  },
  icon: {
    alignContent: 'center',
  },
});

export const focusToTextField = (
  ref: MutableRefObject<TextInput> | RefObject<TextInput>,
  duration = additionalTimeFocusAndroid,
) => {
  constants.isAndroid
    ? setTimeout(() => ref.current && ref.current.focus(), duration)
    : ref.current && ref.current.focus();
};
