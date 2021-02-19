import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { ImageBackground, StyleSheet, TextInput } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { FormikHelpers, useFormik } from 'formik';
import * as yup from 'yup';
import { UIKit } from '@uikit';
import { ConsoleUtils, PopupPrototype, validateRequireField } from '@utils';
import { assets } from '@assets';
import { colors, constants } from '@values';
import styles from './styles';
import { _t } from '@i18n';
import { fetchAPI, updateLocalAuth } from '@services';
import { IStack } from 'screen-props';
import { routes } from '@navigator/routes';
import { useDatabase } from '@nozbe/watermelondb/hooks';

interface Form {
  otp: string;
}
interface Props extends IStack {}

const OTP = memo((props: Props) => {
  const db = useDatabase();

  const params = props.route.params || {};
  const codeRef = useRef<string | undefined>(params?.code);
  const [resent, setResent] = useState(false);
  const [timer, setTimer] = useState(6);

  useEffect(() => {
    const timerRef = setTimeout(() => {
      clearTimeout(timerRef);
      if (timer >= 1) {
        setTimer(timer - 1);
      }
    }, 1000);
    return () => clearTimeout(timerRef);
  }, [timer]);

  const onSubmit = useCallback((values: Form, helper: FormikHelpers<Form>) => {
    if (values.otp !== codeRef.current) {
      helper.setFieldError('otp', _t('otpNotMatch'));
    } else {
      const { username, originUsername, requestType, password } = params;
      if (requestType === 'register') {
        PopupPrototype.showOverlay();
        fetchAPI('auth/register', 'post', {
          username,
          password,
        }).then((val) => {
          PopupPrototype.dismissOverlay();
          if (val.success && val.data.user) {
            updateLocalAuth(db, val.data.user);
            PopupPrototype.showToastWithGravity(
              _t('registerSuccess'),
              'long',
              'bottom',
            );
          } else {
            helper.setFieldError('otp', _t('error'));
          }
        });
      } else {
        props.navigation.push(routes.verifyPassword, {
          username,
          originUsername,
        });
      }
    }
  }, []);

  const onBack = useCallback(() => {
    PopupPrototype.alert(_t('warning'), _t('unsuccessfulProcess'), [
      {
        text: _t('ok'),
        onPress: () => props.navigation.popToTop(),
      },
      { text: _t('cancel') },
    ]);
  }, []);

  const onChangeText = useCallback((text: string) => {
    form.setFieldValue('otp', text);
  }, []);

  const form = useFormik<Form>({
    initialValues: {
      otp: '',
    },
    onSubmit,
    validateOnChange: false,
    validateOnBlur: false,
    validateOnMount: false,
    validationSchema: () =>
      yup.object().shape({
        otp: validateRequireField('OTP'),
      }),
  });

  const resendOtp = useCallback(() => {
    const onResend = props.route.params?.onResend;
    if (typeof onResend === 'function') {
      form.setErrors({});
      try {
        PopupPrototype.showOverlay();
        onResend().then((val: any) => {
          PopupPrototype.dismissOverlay();
          const { code, message } = val || {};
          if (code) {
            codeRef.current = code;
            setResent(true);
          } else {
            form.setFieldError('otp', message);
          }
        });
      } catch (error) {
        PopupPrototype.dismissOverlay();
        form.setFieldError('otp', _t('error'));
        ConsoleUtils.le('Resend error: ', error);
      }
    }
  }, []);

  return (
    <ImageBackground style={styles.bg} source={assets.image.login_background}>
      <KeyboardAwareScrollView
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled">
        <UIKit.Container style={styles.container} PADDING>
          {/* <HeaderText onBack={onBack} title={_t('confirmOtp')} /> */}
          <UIKit.FastImage
            source={assets.image.logo}
            style={styles.logo}
            resizeMode="contain"
          />
          <UIKit.View style={styles.inputWrapper}>
            {!form.values.otp ? (
              <UIKit.Text
                style={[
                  StyleSheet.absoluteFill,
                  styles.input,
                  styles.placeholder,
                ]}>
                OTP
              </UIKit.Text>
            ) : null}
            <TextInput
              style={styles.input}
              clearButtonMode="never"
              keyboardType="numeric"
              autoFocus
              onChangeText={onChangeText}
              maxLength={constants.otpLength}
              textContentType="oneTimeCode"
            />
          </UIKit.View>

          <UIKit.ButtonText
            style={styles.resend}
            color={resent || timer > 0 ? colors.gray : colors.white}
            onPress={resendOtp}
            disabled={resent || timer > 0}
            title={`${_t('resendOtp')} ${timer > 0 ? `(${timer}s)` : ''}`}
          />

          {<UIKit.FormError message={form.errors.otp} />}

          <UIKit.Button
            style={styles.buttonLogin}
            bg={colors.green}
            color={colors.white}
            title={_t('confirmOtp')}
            onPress={form.submitForm}
          />

          <UIKit.Button
            style={styles.buttonBack}
            bg={colors.transparent}
            color={colors.white}
            title={_t('backToHome')}
            onPress={onBack}
          />
        </UIKit.Container>
      </KeyboardAwareScrollView>
    </ImageBackground>
  );
});

export default OTP;
