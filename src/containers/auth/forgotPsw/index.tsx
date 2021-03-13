import React, { memo, useCallback } from 'react';
import { ImageBackground } from 'react-native';
import { FormikHelpers, useFormik } from 'formik';
import * as yup from 'yup';
import { UIKit } from '@uikit';
import {
  PopupPrototype,
  StringPrototype,
  validatePhone,
  validateUsername,
} from '@utils';
import { assets } from '@assets';
import { colors, variants } from '@values';
import styles from './styles';
import { _t } from '@i18n';
import { fetchAPI } from '@services';
import { IStack } from 'screen-props';
import { routes } from '@navigator/routes';

interface Form {
  username: string;
}
interface Props extends IStack {}

const ForgotPassword = memo((props: Props) => {
  const handleRequest = (
    username: string,
    isPhone: boolean,
    originUsername: string,
  ) => {
    return new Promise((resolve) => {
      fetchAPI(`auth/${isPhone ? 'phone' : 'email'}/sendcode/v2`, 'post', {
        [isPhone ? 'username' : 'email']: username,
      }).then((val) => {
        const code = isPhone ? val.data?.otp : val.data?.verify_code;
        const message =
          val.data?.isDuplicate === false ||
          val.data?.message === 'EMAILNOTFOUND'
            ? _t('userNotExists', { username: originUsername })
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
            requestType: 'recover',
          });
        } else {
          formikHelpers.setFieldError('username', message);
        }
      };
      sendOtp();
    },
    [],
  );

  const onBack = useCallback(() => {
    props.navigation.goBack();
  }, []);

  const form = useFormik<Form>({
    initialValues: {
      username: props.route.params?.username,
    },
    onSubmit,
    validateOnChange: false,
    validateOnBlur: false,
    validateOnMount: false,
    validationSchema: () =>
      yup.object().shape({
        username: validateUsername(),
      }),
  });

  return (
    <UIKit.Container>
      <ImageBackground style={styles.bg} source={assets.image.login_background}>
        <UIKit.KeyboardAwareScrollView
          padding
          scrollEnabled={false}
          contentContainerStyle={styles.container}>
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
              returnKeyType="go"
              form={form}
              formID="username"
              autoFocus
              onSubmitEditing={form.submitForm}
              autoCapitalize="none"
              autoCorrect={false}
              autoCompleteType="username"
            />

            <UIKit.FormError message={form.errors.username} />

            <UIKit.Button
              style={styles.buttonLogin}
              bg={colors.green}
              color={colors.white}
              title={_t('confirm')}
              onPress={form.submitForm}
            />

            <UIKit.Button
              style={styles.buttonBack}
              bg={colors.transparent}
              color={colors.white}
              title={_t('back')}
              onPress={onBack}
            />
          </UIKit.View>
        </UIKit.KeyboardAwareScrollView>
      </ImageBackground>
    </UIKit.Container>
  );
});

export default ForgotPassword;
