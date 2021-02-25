import React, {
  useState,
  MutableRefObject,
  useCallback,
  memo,
  useRef,
  useEffect,
  useMemo,
} from 'react';
import * as yup from 'yup';
import { View, TextInput } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { IStack } from 'screen-props';
import { _t } from '@i18n';
import { UIKit } from '@uikit';
import { JsonPrototype, PopupPrototype, validateRequireField } from '@utils';
import { Form, FormikHelpers, useFormik } from 'formik';
import { fetchAPI, silentFetch } from '@services';
import { styles } from './styles';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import { mConfigSchema } from '@database/schemas';
import { configs } from '@values';

interface Props extends IStack {}

interface Form {
  name: string;
  branch: any;
  id?: string;
  amount: string;
  unit: string;
  description?: string;
  imageUri: string;
}

const ProductDetail = memo((props: Props) => {
  const db = useDatabase();

  const scrollRef = useRef<KeyboardAwareScrollView>() as MutableRefObject<KeyboardAwareScrollView>;
  const amountRef = useRef<TextInput>() as MutableRefObject<TextInput>;
  const dataImage = useRef<string>('');

  const data = useRef(props.route.params?.data);
  const [units, setUnits] = useState<string[]>();
  const [branches, setBranches] = useState<any[]>();

  const pickerUnits = useMemo(() => {
    return units ? units.map((i) => ({ label: i, value: i })) : [];
  }, [units]);

  const pickerBranches = useMemo(() => {
    return branches
      ? branches.map((i) => ({ label: i.name, value: i.id }))
      : [];
  }, [branches]);

  const onReFetch = useCallback(() => {
    PopupPrototype.showOverlay();
    silentFetch(() => PopupPrototype.dismissOverlay());
  }, []);

  useEffect(() => {
    mConfigSchema.findConfigByName(db, configs.unit).then((value) => {
      if (value) {
        const { json } = value;
        json ? setUnits(JsonPrototype.tryParse(json)) : onReFetch();
      }
    });

    mConfigSchema.findConfigByName(db, configs.branch).then((value) => {
      if (value) {
        const { json } = value;
        json ? setBranches(JsonPrototype.tryParse(json)) : onReFetch();
      }
    });
  }, [onReFetch]);

  const onSubmit = useCallback(
    (values: Form, formikHelpers: FormikHelpers<Form>) => {
      PopupPrototype.showOverlay();
      fetchAPI('auth/login', 'post', values).then((val) => {
        PopupPrototype.dismissOverlay();
        if (val.success) {
          // updateLocalAuth(db, val.data.user);
        } else {
          formikHelpers.setFieldError('username', _t('unAuthorization'));
        }
      });
    },
    [],
  );

  const form = useFormik<Form>({
    initialValues: {
      name: data.current?.name,
      branch: undefined,
      id: data.current?.id,
      amount: data.current?.amount,
      unit: data.current?.unit,
      description: data.current?.description,
      imageUri: data.current?.medias?.[0]?.source,
    },
    onSubmit,
    validateOnMount: false,
    validateOnBlur: false,
    validateOnChange: false,
    validationSchema: () =>
      yup.object().shape({
        name: validateRequireField(_t('productName')),
        branch: validateRequireField(_t('branch')),
        amount: validateRequireField(_t('productAmount')),
        unit: validateRequireField(_t('unit')),
        imageUri: validateRequireField(_t('productImage')),
      }),
  });

  useEffect(() => {
    if (Object.keys(form.errors).length > 0) {
      scrollRef.current?.scrollToPosition(0, 0);
    }
  }, [form.errors, scrollRef.current]);

  const onSelectBranch = useCallback(
    (value: string | number) => form.setFieldValue('branch', value),
    [],
  );
  const onSelectUnit = useCallback(
    (value: string | number) => form.setFieldValue('unit', value),
    [],
  );
  const onAmountPress = useCallback(() => amountRef.current?.focus(), []);

  const onSelectImage = useCallback(() => {
    PopupPrototype.showCameraSheetSingle(_t('productImage')).then((value) => {
      if (value.success) {
        const { data: _data, path } = value.images;
        form.setFieldValue('imageUri', path);
        dataImage.current = _data || '';
      }
    });
  }, []);

  console.log('form', form.values);

  return (
    <UIKit.Container>
      <UIKit.KeyboardAwareScrollView paddingH ref={scrollRef}>
        <View style={styles.section}>
          <UIKit.Text style={styles.label}>{_t('productName')}</UIKit.Text>
          <UIKit.FormField style={styles.input} formID="name" form={form} />
          <UIKit.FormError message={form.errors.name} />
        </View>

        <UIKit.View style={[styles.section, styles.row]}>
          <UIKit.View style={styles.flex}>
            <UIKit.Text style={styles.label}>{_t('branch')}</UIKit.Text>
            <UIKit.View style={styles.input}>
              <UIKit.PickerSelect
                items={pickerBranches}
                onValueChange={onSelectBranch}
              />
            </UIKit.View>
          </UIKit.View>
          <UIKit.View style={styles.divider} />
          <UIKit.View style={styles.flex}>
            <UIKit.Text style={styles.label}>{_t('productCode')}</UIKit.Text>
            <UIKit.FormField
              formID="id"
              form={form}
              style={styles.input}
              clearButtonMode="never"
              editable={!data.current}
            />
          </UIKit.View>
        </UIKit.View>
        <UIKit.FormError message={form.errors.branch || form.errors.id} />

        <UIKit.View style={[styles.section, styles.row]}>
          <UIKit.View style={styles.flex}>
            <UIKit.Text style={styles.label}>{_t('productAmount')}</UIKit.Text>
            <UIKit.Touchable
              activeOpacity={1}
              style={[styles.input, styles.amount]}
              onPress={onAmountPress}>
              <UIKit.CurrencyField
                ref={amountRef}
                formID="amount"
                form={form}
                precision={0}
                value={parseFloat(form.values.amount)}

                // formProps={form}
                // containerStyle={styles.amountContainer}
                // clearButtonMode="never"
              />
              {/* {form.values.amount ? (
                <UIKit.Text fontSize={variants.subTitle} bold>
                  ₫
                </UIKit.Text>
              ) : null} */}
            </UIKit.Touchable>
          </UIKit.View>
          <UIKit.View style={styles.divider} />
          <UIKit.View style={styles.flex}>
            <UIKit.Text style={styles.label}>{_t('unit')}</UIKit.Text>
            <UIKit.View style={styles.input}>
              <UIKit.PickerSelect
                items={pickerUnits}
                onValueChange={onSelectUnit}
              />
            </UIKit.View>
          </UIKit.View>
        </UIKit.View>
        <UIKit.FormError message={form.errors.amount || form.errors.unit} />

        <UIKit.View style={styles.section}>
          <UIKit.Text style={styles.label}>{_t('description')}</UIKit.Text>
          <UIKit.View style={styles.desWrapper}>
            <UIKit.FormField
              multiline
              scrollEnabled={false}
              style={styles.des}
              formID="description"
              form={form}
              clearButtonMode="never"
            />
          </UIKit.View>
        </UIKit.View>

        <UIKit.View style={styles.section}>
          <UIKit.Text style={styles.label}>{_t('productImage')}</UIKit.Text>
          <UIKit.Touchable style={styles.imageWrapper} onPress={onSelectImage}>
            <UIKit.FastImage
              style={styles.image}
              source={{ uri: form.values.imageUri }}
            />
            <UIKit.VectorIcons name="ios-camera" style={styles.camera} />
          </UIKit.Touchable>
          <UIKit.FormError message={form.errors.imageUri} />
        </UIKit.View>
        <UIKit.Button
          title={data.current ? _t('update') : _t('createProduct')}
          style={styles.btn}
          onPress={form.submitForm}
        />
      </UIKit.KeyboardAwareScrollView>
    </UIKit.Container>
  );
});

export default ProductDetail;
