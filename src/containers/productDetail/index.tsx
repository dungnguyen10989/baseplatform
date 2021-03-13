import React, {
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
import { PopupPrototype, StringPrototype, validateRequireField } from '@utils';
import { Form, useFormik } from 'formik';
import { styles } from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@state/';
import { productActions } from '@state/product';
import { Modalize } from 'react-native-modalize';
import CheckBox from '@react-native-community/checkbox';
import { colors, variants } from '@values';

interface Props extends IStack {}

interface Form {
  name: string;
  branch: Array<any>;
  code: string;
  amount: string;
  unit: string;
  description?: string;
  imageUri: string;
}

const ProductDetail = memo((props: Props) => {
  const dispatch = useDispatch();
  const scrollRef = useRef<KeyboardAwareScrollView>() as MutableRefObject<KeyboardAwareScrollView>;
  const amountRef = useRef<TextInput>() as MutableRefObject<TextInput>;
  const modalRef = useRef<Modalize>() as MutableRefObject<Modalize>;
  const dataImage = useRef<string>('');
  const data = useRef<any>(props.route.params?.data);

  useEffect(() => {
    const params = props.route.params?.data;
    const onSuccess = (res: any) => {
      data.current = res;
    };
    params?.id &&
      dispatch(productActions.getDetail.start(params.id, onSuccess));
    return () => {
      dispatch(productActions.clearDetail());
    };
  }, []);

  const units = useSelector((state: RootState) =>
    state.values.units?.asMutable(),
  );
  const branches = useSelector((state: RootState) =>
    state.values.branches?.asMutable(),
  );

  const pickerUnits = useMemo(() => {
    return units ? units.map((i) => ({ label: i, value: i })) : [];
  }, [units]);

  const onSubmit = useCallback((values: Form) => {
    const onSuccess = () =>
      PopupPrototype.alert(
        _t('success'),
        _t(data.current?.id ? 'updateProductSuccess' : 'createProductSuccess'),
        [
          {
            text: _t('ok'),
            onPress: () => props.navigation.pop(),
          },
        ],
      );
    const onError = () => PopupPrototype.alert(_t('unsuccess'), _t('error'));
    const payload: any = {
      ...values,
      id: data.current?.id,
      image: StringPrototype.genBase64(
        dataImage.current,
        data.current?.imageUri,
      ),
    };
    if (dataImage.current) {
      delete payload.imageUri;
      payload.index = 0;
    }
    dispatch(productActions.createProduct.start(payload, onSuccess, onError));
  }, []);

  const form = useFormik<Form>({
    initialValues: {
      name: data.current?.name,
      branch: data.current?.branch || [],
      code: data.current?.code,
      amount: data.current?.amount,
      unit: data.current?.unit,
      description: data.current?.description,
      imageUri: data.current?.medias?.[0]?.source,
    },
    onSubmit,
    validateOnMount: false,
    validateOnBlur: false,
    validateOnChange: false,
    enableReinitialize: true,
    validationSchema: () =>
      yup.object().shape({
        name: validateRequireField(_t('productName')),
        branch: validateRequireField(_t('branch')),
        amount: validateRequireField(_t('productAmount')),
        unit: validateRequireField(_t('unit')),
        imageUri: validateRequireField(_t('image')),
      }),
  });

  useEffect(() => {
    if (!form.isValid && !form.errors.imageUri) {
      scrollRef.current?.scrollToPosition(0, 0);
    }
  }, [form.isValid, form.errors.imageUri]);

  const onSelectBranch = useCallback(() => modalRef.current?.open(), []);
  const onSelectUnit = useCallback(
    (value: string | number) => form.setFieldValue('unit', value),
    [],
  );
  const onAmountPress = useCallback(() => amountRef.current?.focus(), []);

  const onSelectImage = useCallback(() => {
    PopupPrototype.showCameraSheetSingle(_t('uploadImage')).then((value) => {
      if (value.success) {
        const { data: _data, path } = value.images;
        form.setFieldValue('imageUri', path);
        dataImage.current = _data || '';
      }
    });
  }, []);

  const onBranchItemPress = useCallback(
    (item: any, check: boolean) => {
      let newValue: Array<any> = [];
      if (check) {
        newValue = form.values.branch.filter((i) => i !== item.id);
      } else {
        newValue = form.values.branch.concat(item.id);
      }
      form.setFieldValue('branch', newValue);
    },
    [form.values.branch],
  );

  const branchText = useMemo(() => {
    const { branch } = form.values;
    let result = branches?.filter((i) => {
      return branch?.some((item) => item === i.id);
    });
    return result.map((i) => i?.name).join(', ');
  }, [branches, form.values.branch]);

  const renderSelectedBranches = useMemo(() => {
    return branches?.map((branch) => {
      const check = form.values.branch.some((i) => i === branch.id);
      return (
        <UIKit.Touchable
          key={`${branch.id}`}
          onPress={onBranchItemPress.bind(null, branch, check)}>
          <UIKit.View style={styles.checkItem}>
            <CheckBox
              disabled
              value={check}
              boxType="square"
              style={styles.checkbox}
              tintColor={colors.gray}
              onCheckColor={colors.button}
              onTintColor={colors.button}
            />
            <UIKit.Text style={styles.checkLabel}>{branch.name}</UIKit.Text>
          </UIKit.View>
        </UIKit.Touchable>
      );
    });
  }, [branches, form.values.branch, onBranchItemPress]);

  return (
    <UIKit.Container>
      <UIKit.KeyboardAwareScrollView paddingH ref={scrollRef}>
        <View style={styles.section}>
          <UIKit.Text style={styles.label}>{_t('productName')}</UIKit.Text>
          <UIKit.FormField
            style={styles.input}
            formID="name"
            form={form}
            autoFocus={!data.current}
          />
          <UIKit.FormError message={form.errors.name} />
        </View>

        <UIKit.View style={styles.section}>
          <UIKit.Text style={styles.label}>{_t('branch')}</UIKit.Text>

          <UIKit.Touchable
            onPress={onSelectBranch}
            style={[styles.input, styles.branches]}>
            <UIKit.Text flex numberOfLines={2}>
              {branchText}
            </UIKit.Text>
            <UIKit.VectorIcons
              provider="FontAwesome"
              name="caret-down"
              size={variants.normal}
            />
          </UIKit.Touchable>

          <UIKit.FormError message={form.errors.branch} />
        </UIKit.View>

        <UIKit.View style={styles.section}>
          <UIKit.View style={styles.flex}>
            <UIKit.Text style={styles.label}>{_t('productCode')}</UIKit.Text>
            <UIKit.FormField
              editable={!data.current}
              formID="code"
              form={form}
              style={styles.input}
              clearButtonMode="never"
            />
          </UIKit.View>
          <UIKit.FormError message={form.errors.code} />
        </UIKit.View>

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
              />
            </UIKit.Touchable>
          </UIKit.View>
          <UIKit.View style={styles.divider} />
          <UIKit.View style={styles.flex}>
            <UIKit.Text style={styles.label}>{_t('unit')}</UIKit.Text>
            <UIKit.View style={styles.input}>
              <UIKit.PickerSelect
                labelStyle={styles.inputTransparent}
                items={pickerUnits}
                value={form.values.unit}
                selectedValue={form.values.unit}
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
          <UIKit.Text style={styles.label}>{_t('image')}</UIKit.Text>
          <UIKit.Touchable style={styles.imageWrapper} onPress={onSelectImage}>
            <UIKit.FastImage
              style={styles.image}
              source={{ uri: form.values.imageUri }}
              withSandWatch={false}
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
      <Modalize
        ref={modalRef}
        adjustToContentHeight
        closeOnOverlayTap
        handlePosition="inside"
        useNativeDriver
        withOverlay
        withHandle
        threshold={100}
        withReactModal>
        <UIKit.View style={styles.branchSelectWrapper}>
          {renderSelectedBranches}
        </UIKit.View>
      </Modalize>
    </UIKit.Container>
  );
});

export default ProductDetail;
