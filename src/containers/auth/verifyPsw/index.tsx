import React, { memo, useCallback, useRef } from 'react';
import { ImageBackground, TextInput } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { FormikHelpers, useFormik } from 'formik';
import * as yup from 'yup';
import { UIKit } from '@uikit';
import { PopupPrototype, validatePassword } from '@utils';
import { assets } from '@assets';
import { colors, variants } from '@values';
import styles from './styles';
import { _t } from '@i18n';
import { fetchAPI, updateLocalAuth } from '@services';
import { IStack } from 'screen-props';
import { useDatabase } from '@nozbe/watermelondb/hooks';

interface Form {
  password: string;
  rePassword: string;
}
interface Props extends IStack {}

const VerifyPsw = memo((props: Props) => {
  const db = useDatabase();
  const rePswRef = useRef<TextInput>() as React.MutableRefObject<TextInput>;

  const onSubmit = useCallback((values: Form, helper: FormikHelpers<Form>) => {
    const params = props.route.params || {};
    const { username } = params;
    PopupPrototype.showOverlay();
    fetchAPI('auth/password-recover', 'post', {
      username,
      password: values.password,
    }).then((val) => {
      PopupPrototype.dismissOverlay();
      if (val.success && val.data.user) {
        updateLocalAuth(db, val.data.user);
        PopupPrototype.showToastWithGravity(
          _t('recoverSuccess'),
          'long',
          'bottom',
        );
      } else {
        helper.setFieldError('password', _t('error'));
      }
    });
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

  const form = useFormik<Form>({
    initialValues: {
      password: '',
      rePassword: '',
    },
    onSubmit,
    validateOnChange: false,
    validateOnBlur: false,
    validateOnMount: false,
    validationSchema: () =>
      yup.object().shape({
        password: validatePassword(),
        rePassword: yup
          .string()
          .test('passwords-match', _t('vdPswNotMatch'), function (value) {
            return this.parent.password === value;
          }),
      }),
  });

  return (
    <ImageBackground style={styles.bg} source={assets.image.login_background}>
      <KeyboardAwareScrollView
        scrollEnabled={false}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled">
        <UIKit.Container style={styles.container} PADDING>
          <UIKit.FastImage
            source={assets.image.logo}
            style={styles.logo}
            resizeMode="contain"
          />
          <UIKit.IconInput
            iconSource={assets.icon.ic_lock}
            containerStyle={styles.input}
            iconStyle={styles.icon}
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

          <UIKit.IconInput
            iconSource={assets.icon.ic_lock}
            containerStyle={styles.input}
            iconStyle={styles.icon}
            placeholder={_t('rePassword')}
            clearButtonMode="while-editing"
            clearButtonColor={colors.gray}
            fontSize={variants.title}
            secureTextEntry
            onSubmitEditing={form.submitForm}
            nextRef={rePswRef}
            returnKeyType="go"
            formProps={form}
            formID="rePassword"
            textContentType="oneTimeCode"
          />

          <UIKit.FormError message={Object.values(form.errors)[0]} />

          <UIKit.Button
            style={styles.buttonLogin}
            bg={colors.green}
            color={colors.white}
            title={_t('changePassword')}
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

export default VerifyPsw;
