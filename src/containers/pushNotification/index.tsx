import React, { useCallback, memo, useLayoutEffect } from 'react';
import * as yup from 'yup';
import { IStack } from 'screen-props';
import { _t } from '@i18n';
import { UIKit } from '@uikit';
import {
  DeviceManager,
  JsonPrototype,
  PopupPrototype,
  validateRequireField,
} from '@utils';
import { Form, FormikHelpers, useFormik } from 'formik';
import { fetchAPI } from '@services';
import { styles } from './styles';
import { configs, constants } from '@values';
import { mConfigSchema } from '@database/schemas';
import { useDatabase } from '@nozbe/watermelondb/hooks';

interface Props extends IStack {}

interface Form {
  title: string;
  content: string;
}

const PushNotification = memo((props: Props) => {
  const db = useDatabase();
  const onSubmit = useCallback(
    (values: Form, formikHelpers: FormikHelpers<Form>) => {
      PopupPrototype.showOverlay();
      fetchAPI('set/app/save/notify', 'post', values).then((val) => {
        PopupPrototype.dismissOverlay();
        if (val.data) {
          PopupPrototype.alert(_t('success'), _t('requestPushSuccess'), [
            {
              text: _t('ok'),
              onPress: () => props.navigation.pop(),
            },
          ]);
        } else {
          formikHelpers.setFieldError('title', _t('requestPushFailure'));
        }
      });
    },
    [],
  );

  const form = useFormik<Form>({
    initialValues: {
      title: '',
      content: '',
    },
    onSubmit,
    validateOnMount: false,
    validateOnBlur: false,
    validateOnChange: false,
    validationSchema: () =>
      yup.object().shape({
        title: validateRequireField(_t('title')).test(
          'title-length',
          _t('vdTitleMinLength', { length: 10 }),
          (value) => Boolean(value && value.length >= 10),
        ),
        content: validateRequireField(_t('content')).test(
          'content-length',
          _t('vdContentMinLength', { length: 50 }),
          (value) => Boolean(value && value.length >= 50),
        ),
      }),
  });

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => {
        return (
          <UIKit.ButtonText
            textStyle={styles.done}
            title={_t('send')}
            onPress={form.submitForm}
          />
        );
      },
    });
  }, [form.submitForm]);

  const onSupport = useCallback(() => {
    // mConfigSchema.getConfigJson(db, configs.user).then((response) => {
    //   if (response) {
    //     const { id, json } = response;
    //     if (json) {
    //       const obj = JsonPrototype.tryParse(json);
    //       const { phone } = obj;
    //       console.log('phone', obj);

    //       // DeviceManager.makeCall(phone);
    //     }
    //   }
    // });
    // TODO: request phone here
    DeviceManager.makeCall('phone');
  }, []);

  return (
    <UIKit.Container>
      <UIKit.KeyboardAwareScrollView paddingH>
        <UIKit.Text style={styles.label}>{_t('labelPush')}</UIKit.Text>
        <UIKit.FormField
          formID="title"
          form={form}
          style={styles.input}
          clearButtonMode="while-editing"
          paddingV={constants.halfPadding}
          autoFocus
          withError={false}
        />

        <UIKit.Text style={styles.label}>{_t('labelPushContent')}</UIKit.Text>
        <UIKit.FormField
          formID="content"
          form={form}
          style={styles.content}
          multiline
          withError={false}
        />
        <UIKit.FormError message={form.errors.title || form.errors.content} />
        <UIKit.Text style={styles.note}>{_t('labelPushNote')}</UIKit.Text>
      </UIKit.KeyboardAwareScrollView>
      <UIKit.Button
        title={_t('support')}
        style={styles.btn}
        onPress={onSupport}
      />
    </UIKit.Container>
  );
});

export default PushNotification;
