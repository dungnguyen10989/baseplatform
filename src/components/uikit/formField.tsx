import React, { forwardRef, memo, useCallback, ComponentType } from 'react';
import {
  TextInput,
  TextInputFocusEventData,
  NativeSyntheticEvent,
} from 'react-native';
import { FormikProps } from 'formik';
import { isEqual } from 'lodash';
import { colors } from '@values';

import FormError from './formError';
import TextField, { ITextFieldProps } from './textField';

export interface FormProps {
  formID: string;
  form: FormikProps<any>;
  withError?: boolean;
  errorColor?: string;
}

export interface Props extends ITextFieldProps, FormProps {}

const FormField = forwardRef<TextInput, Props>((props, ref) => {
  const {
    formID,
    form,
    withError,
    errorColor,
    returnKeyType,
    autoFocus,
    onFocus,
    onBlur,
    ...rest
  } = props;

  const { handleBlur, setFieldTouched, validateOnChange } = form;

  const error = formID && form ? form.errors[formID] : undefined;

  const onChangeText = useCallback(
    (text: string) => {
      form.setFieldValue(formID, text, form.validateOnChange);
    },
    [form, formID],
  );

  const _onFocus = useCallback(
    (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      onFocus?.(e);
      setFieldTouched(formID, true, validateOnChange);
    },
    [formID, validateOnChange, setFieldTouched, onFocus],
  );

  const _onBlur = useCallback(
    (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      onBlur?.(e);
      handleBlur(formID)(e);
      setFieldTouched(formID, undefined, validateOnChange);
    },
    [formID, validateOnChange, onBlur, handleBlur, setFieldTouched],
  );

  return (
    <>
      <TextField
        {...rest}
        ref={ref}
        autoFocus={autoFocus}
        value={form.values[formID]}
        onChangeText={onChangeText}
        onFocus={_onFocus}
        onBlur={_onBlur}
      />
      {!!withError && (
        <FormError
          message={error as string}
          color={error ? errorColor : colors.transparent}
        />
      )}
    </>
  );
});

(FormField as ComponentType<Props>).defaultProps = {
  withError: true,
  errorColor: colors.error,
};

export default memo(FormField, (prev: Props, next: Props) => {
  if (next.form.touched[next.formID] !== prev.form.touched[prev.formID]) {
    return false;
  }
  if (!next.form.touched[next.formID]) {
    return true;
  }
  if (!isEqual(prev.form.values, next.form.values)) {
    return prev.form.values[prev.formID] === next.form.values[next.formID];
  }
  if (!isEqual(prev.form.errors, next.form.errors)) {
    return prev.form.errors[prev.formID] === next.form.errors[next.formID];
  }
  return false;
});
