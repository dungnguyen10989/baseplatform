import React, { memo, useCallback, useEffect, useRef } from 'react';
import { ImageBackground, TextInput } from 'react-native';
import formik, { useFormik } from 'formik';
import * as yup from 'yup';
import { UIKit } from '@uikit';
import {
  JsonPrototype,
  PopupPrototype,
  validatePassword,
  validateUsername,
} from '@utils';
import { assets } from '@assets';
import { colors, configs, variants } from '@values';
import styles from './styles';
import { _t } from '@i18n';
import {
  fetchAPI,
  setHttpAuthorizationToken,
  updateLocalAuth,
} from '@services';
import { mConfigSchema } from '@database/schemas';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import { IStack } from 'screen-props';
import { routes } from '@navigator/routes';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { containerNav } from '@navigator/helper';

interface Form {
  username: string;
  password: string;
}
interface Props extends IStack {}

const Login = memo((props: Props) => {
  const db = useDatabase();
  const pswRef = useRef<TextInput>() as React.MutableRefObject<TextInput>;

  const onSubmit = useCallback(
    (values: Form, formikHelpers: formik.FormikHelpers<Form>) => {
      PopupPrototype.showOverlay();
      fetchAPI('auth/login', 'post', {
        username: values.username,
        password: values.password,
      }).then((val) => {
        PopupPrototype.dismissOverlay();
        if (val.success) {
          updateLocalAuth(db, val.data.user);
        } else {
          formikHelpers.setFieldError('username', _t('unAuthorization'));
        }
      });
    },
    [],
  );

  const form = useFormik<Form>({
    initialValues: {
      username: 'tainc@ftcjsc.com',
      password: 'ftc2018',
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

  useEffect(() => {
    const sub = mConfigSchema.getConfigJson(db, configs.user);
    sub.then((response) => {
      if (response) {
        const { id, json } = response;
        if (json) {
          const obj = JsonPrototype.tryParse(json);
          const { name, token } = obj;
          setHttpAuthorizationToken(token);
          PopupPrototype.showOverlay();
          fetchAPI('get/auth/app/userinfo', 'get').then((val) => {
            PopupPrototype.dismissOverlay();
            if (val.success) {
              updateLocalAuth(db, val.data.user);
            } else {
              mConfigSchema.deleteConfig(db, configs.user);
            }
          });
        }
      }
    });
    return () => sub.cancel();
  }, []);

  const onForgot = useCallback(() => {
    props.navigation.push(routes.forgotPassword, {
      username: form.values.username,
    });
  }, [form.values.username]);

  const onRegister = useCallback(() => {
    props.navigation.push(routes.register);
  }, []);

  return (
    <ImageBackground style={styles.bg} source={assets.image.login_background}>
      <KeyboardAwareScrollView
        scrollEnabled={false}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled">
        <UIKit.Container PADDING>
          <UIKit.FastImage
            source={assets.image.logo}
            style={styles.logo}
            resizeMode="contain"
          />

          <UIKit.IconInput
            iconSource={assets.icon.ic_account}
            containerStyle={[styles.input, styles.form]}
            iconStyle={styles.icon}
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
          />

          <UIKit.IconInput
            ref={pswRef}
            iconSource={assets.icon.ic_lock}
            containerStyle={styles.input}
            iconStyle={styles.icon}
            placeholder={_t('password')}
            clearButtonMode="while-editing"
            clearButtonColor={colors.gray}
            fontSize={variants.title}
            secureTextEntry
            onSubmitEditing={form.submitForm}
            returnKeyType="go"
            formProps={form}
            formID="password"
          />

          <UIKit.FormError message={Object.values(form.errors)[0]} />

          <UIKit.Button
            style={styles.buttonLogin}
            // disabled={!form.isValid}
            // bg={!form.isValid ? colors.disabledButton : colors.green}
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
        </UIKit.Container>
      </KeyboardAwareScrollView>
    </ImageBackground>
  );
});

export default Login;
