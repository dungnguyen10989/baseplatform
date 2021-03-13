import React, { memo, useCallback, useEffect, useRef } from 'react';
import { ImageBackground, TextInput } from 'react-native';
import formik, { useFormik } from 'formik';
import * as yup from 'yup';
import { UIKit } from '@uikit';
import {
  JsonPrototype,
  StringPrototype,
  validatePassword,
  validatePhone,
  validateUsername,
} from '@utils';
import { assets } from '@assets';
import { colors, configs, variants } from '@values';
import styles from './styles';
import { _t } from '@i18n';
import { setHttpAuthorizationToken } from '@services';
import { mConfigSchema } from '@database/schemas';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import { IStack } from 'screen-props';
import { routes } from '@navigator/routes';
import { useAppDispatch } from '@state/';
import { authActions } from '@state/auth';

interface Form {
  username: string;
  password: string;
}
interface Props extends IStack {}

const Login = memo((props: Props) => {
  const db = useDatabase();
  const pswRef = useRef<TextInput>() as React.MutableRefObject<TextInput>;

  const dispatch = useAppDispatch();
  useEffect(() => {
    mConfigSchema.findConfigByName(db, configs.user).then((response) => {
      if (response) {
        const { json } = response;
        if (json) {
          const obj = JsonPrototype.tryParse(json);
          const { token } = obj;
          setHttpAuthorizationToken(token);
          dispatch(authActions.getInfo.start());
        }
      }
    });
  }, []);

  const onSubmit = useCallback(
    (values: Form, formikHelpers: formik.FormikHelpers<Form>) => {
      const username = validatePhone(values.username)
        ? StringPrototype.normalizeVNPhone(values.username)
        : values.username;

      dispatch(
        authActions.login.start(
          { username, password: values.password },
          undefined,
          () => formikHelpers.setFieldError('username', _t('unAuthorization')),
        ),
      );
    },
    [],
  );

  const form = useFormik<Form>({
    initialValues: {
      // username: 'tainc@ftcjsc.com',
      // password: 'ftc2018',
      username: '',
      password: '',
    },
    onSubmit,
    validateOnMount: false,
    validateOnBlur: false,
    validateOnChange: false,
    validationSchema: () =>
      yup.object().shape({
        username: validateUsername(),
        password: validatePassword(),
      }),
  });

  const onForgot = useCallback(() => {
    props.navigation.push(routes.forgotPassword, {
      username: form.values.username,
    });
  }, [form.values.username]);

  const onRegister = useCallback(
    () => props.navigation.push(routes.register),
    [],
  );

  return (
    <UIKit.Container>
      <ImageBackground style={styles.bg} source={assets.image.login_background}>
        <UIKit.KeyboardAwareScrollView
          padding
          scrollEnabled={false}
          contentContainerStyle={styles.content}>
          <UIKit.View style={styles.top}>
            <UIKit.FastImage
              source={assets.image.logo}
              style={styles.logo}
              resizeMode="contain"
            />
          </UIKit.View>
          <UIKit.View style={styles.bottom}>
            <UIKit.IconField
              iconSource={assets.icon.ic_account}
              containerStyle={styles.input}
              iconStyle={styles.icon}
              placeholder={_t('phUsername')}
              clearButtonMode="while-editing"
              fontSize={variants.title}
              nextRef={pswRef}
              returnKeyType="next"
              form={form}
              formID="username"
              autoCapitalize="none"
              autoCorrect={false}
              autoCompleteType="username"
              withError={false}
            />

            <UIKit.IconField
              ref={pswRef}
              iconSource={assets.icon.ic_lock}
              containerStyle={styles.input}
              iconStyle={styles.icon}
              placeholder={_t('password')}
              clearButtonMode="while-editing"
              fontSize={variants.title}
              secureTextEntry
              onSubmitEditing={form.submitForm}
              returnKeyType="go"
              form={form}
              formID="password"
              withError={false}
            />
            <UIKit.FormError
              message={form.errors.username || form.errors.password}
            />

            <UIKit.Button
              style={styles.buttonLogin}
              bg={colors.green}
              color={colors.white}
              title={_t('login')}
              onPress={form.submitForm}
            />
            <UIKit.View style={styles.control}>
              <UIKit.ButtonText
                style={styles.controlBtn}
                title={_t('registerNow')}
                color={colors.white}
                onPress={onRegister}
                paddingV={3}
              />
              <UIKit.View style={styles.separator} />
              <UIKit.ButtonText
                style={styles.controlBtn}
                title={_t('forgotPsw')}
                color={colors.white}
                onPress={onForgot}
                paddingV={3}
              />
            </UIKit.View>
          </UIKit.View>
        </UIKit.KeyboardAwareScrollView>
      </ImageBackground>
    </UIKit.Container>
  );
});

export default Login;
