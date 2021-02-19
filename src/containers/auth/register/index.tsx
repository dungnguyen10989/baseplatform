import React, { memo, useCallback, useEffect, useRef } from 'react';
import { ImageBackground, TextInput } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { FormikHelpers, useFormik } from 'formik';
import * as yup from 'yup';
import { UIKit } from '@uikit';
import {
  CancelablePromise,
  PopupPrototype,
  StringPrototype,
  validatePassword,
  validatePhone,
  validateUsername,
} from '@utils';
import { assets } from '@assets';
import { colors, configs, variants } from '@values';
import styles from './styles';
import { _t } from '@i18n';
import { fetchAPI } from '@services';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import { IStack } from 'screen-props';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { routes } from '@navigator/routes';

interface Form {
  username: string;
  password: string;
  rePassword: string;
  checked: boolean;
}

interface Props extends IStack {}

const Register = memo((props: Props) => {
  const db = useDatabase();
  const subRef = useRef<CancelablePromise<any>>();
  const pswRef = useRef<TextInput>() as React.MutableRefObject<TextInput>;
  const rePswRef = useRef<TextInput>() as React.MutableRefObject<TextInput>;

  const handleRequest = (
    username: string,
    isPhone: boolean,
    originUsername: string,
  ) => {
    return new Promise((resolve) => {
      fetchAPI(`auth/${isPhone ? 'phone' : 'email'}/verify/v2`, 'post', {
        [isPhone ? 'username' : 'email']: username,
      }).then((val) => {
        const sent = isPhone ? val.data?.is_sended : true;
        const code = !sent
          ? undefined
          : isPhone
          ? val.data?.otp
          : val.data?.verify_code;
        const message =
          val.data?.isDuplicate || val.data?.message === 'EMAILDUPLICATE'
            ? _t('userExists', { username: originUsername })
            : !sent
            ? _t('cannotSendOtp', { username: originUsername })
            : _t('error');
        if (code) {
          PopupPrototype.showToastWithGravity(
            _t('otpSent', { username: originUsername }),
            'long',
            'bottom',
          );
        }
        resolve({ code, message });
      });
    }) as Promise<{ code: string | undefined; message: string }>;
  };

  const onSubmit = useCallback(
    (values: Form, formikHelpers: FormikHelpers<Form>) => {
      const username = StringPrototype.normalizeVNPhone(values.username);
      const isPhone = validatePhone(username);

      const sendOtp = async () => {
        PopupPrototype.showOverlay();
        const { code, message } = await handleRequest(
          username,
          isPhone,
          values.username,
        );
        PopupPrototype.dismissOverlay();

        if (code) {
          props.navigation.push(routes.otp, {
            onResend: () => handleRequest(username, isPhone, values.username),
            code,
            isPhone,
            username,
            requestType: 'register',
            password: values.password,
          });
        } else {
          formikHelpers.setFieldError('username', message);
        }
      };
      sendOtp();
    },
    [],
  );

  const form = useFormik<Form>({
    initialValues: {
      username: '',
      password: '',
      rePassword: '',
      checked: false,
    },
    onSubmit,
    validateOnChange: false,
    validateOnMount: false,
    validateOnBlur: false,
    validationSchema: () =>
      yup.object().shape({
        username: validateUsername(),
        password: validatePassword(),
        checked: yup.boolean().isTrue(_t('vdRequestCheckPrivacy')),
        rePassword: yup
          .string()
          .test('passwords-match', _t('vdPswNotMatch'), function (value) {
            return this.parent.password === value;
          }),
      }),
  });

  const onBack = useCallback(() => {
    props.navigation.goBack();
  }, []);

  const onCheck = useCallback(
    (value: boolean) => {
      form.setFieldValue('checked', value);
    },
    [form.setFieldValue],
  );

  const onPrivacy = useCallback(() => {
    props.navigation.push(routes.webview, {
      uri: 'https://admin.babaza.vn/api/v1/get/policy',
    });
  }, []);

  const onAgreement = useCallback(() => {
    props.navigation.push(routes.webview, {
      uri: 'https://admin.babaza.vn/api/v1/get/use-agreement',
    });
  }, []);

  return (
    <ImageBackground
      style={styles.bg}
      source={assets.image.register_background}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        keyboardDismissMode="interactive"
        extraHeight={200}
        keyboardShouldPersistTaps="handled">
        <UIKit.View style={styles.form}>
          <UIKit.View style={styles.absolute}>
            <UIKit.Text style={styles.slogan}>{_t('register')}</UIKit.Text>
          </UIKit.View>
          <UIKit.TextField
            containerStyle={styles.inputContainer}
            style={styles.input}
            placeholderTextColor={colors.skyBlue5}
            color={colors.skyBlue}
            placeholder={_t('phUsername')}
            clearButtonMode="while-editing"
            clearButtonColor={colors.gray}
            fontSize={variants.title}
            nextRef={pswRef}
            returnKeyType="next"
            formProps={form}
            formID="username"
            autoCapitalize="none"
            autoCorrect={false}
            autoCompleteType="username"
            autoFocus
          />

          <UIKit.TextField
            ref={pswRef}
            containerStyle={styles.inputContainer}
            style={styles.input}
            placeholderTextColor={colors.skyBlue5}
            color={colors.skyBlue}
            placeholder={_t('password')}
            clearButtonMode="while-editing"
            clearButtonColor={colors.gray}
            fontSize={variants.title}
            secureTextEntry
            nextRef={rePswRef}
            returnKeyType="next"
            formProps={form}
            formID="password"
            textContentType="oneTimeCode"
          />

          <UIKit.TextField
            ref={rePswRef}
            containerStyle={styles.inputContainer}
            style={styles.input}
            placeholderTextColor={colors.skyBlue5}
            color={colors.skyBlue}
            placeholder={_t('rePassword')}
            clearButtonMode="while-editing"
            clearButtonColor={colors.gray}
            fontSize={variants.title}
            secureTextEntry
            onSubmitEditing={form.submitForm}
            returnKeyType="go"
            formProps={form}
            formID="rePassword"
            textContentType="oneTimeCode"
          />
          <UIKit.View style={styles.privacyWrapper}>
            <CheckBox
              boxType="square"
              value={form.values.checked}
              onValueChange={onCheck}
              style={styles.checkbox}
              tintColor={colors.gray}
              onCheckColor={colors.skyBlue}
              onTintColor={colors.skyBlue}
            />
            <UIKit.Text style={styles.privacyText}>
              {_t('privacy1')}
              <UIKit.Text color={colors.skyBlue} onPress={onPrivacy}>{` ${_t(
                'privacy2',
              )} `}</UIKit.Text>
              {`${_t('and')} `}
              <UIKit.Text color={colors.skyBlue} onPress={onAgreement}>{`${_t(
                'privacy3',
              )} `}</UIKit.Text>
              {_t('privacy4')}
            </UIKit.Text>
          </UIKit.View>

          <UIKit.FormError message={Object.values(form.errors)[0]} />

          <UIKit.Button
            style={styles.buttonLogin}
            bg={colors.green}
            color={colors.white}
            title={_t('register')}
            onPress={form.submitForm}
          />

          <UIKit.Button
            style={styles.buttonBack}
            bg={colors.transparent}
            color={colors.textColor}
            title={_t('back')}
            onPress={onBack}
          />
        </UIKit.View>
      </KeyboardAwareScrollView>
    </ImageBackground>
  );
});

export default Register;
