import React, {
  MutableRefObject,
  useCallback,
  memo,
  useRef,
  useEffect,
  useMemo,
} from 'react';
import * as yup from 'yup';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { IStack } from 'screen-props';
import { _t } from '@i18n';
import { UIKit } from '@uikit';
import { PopupPrototype, StringPrototype, validateRequireField } from '@utils';
import { Form, FormikHelpers, useFormik } from 'formik';
import { styles } from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@state/';
import { redeemActions } from '@state/redeem';
import { Modalize } from 'react-native-modalize';
import CheckBox from '@react-native-community/checkbox';
import { colors, variants } from '@values';

interface Props extends IStack {}

interface Form {
  name: string;
  branch: Array<any>;
  code: string;
  point: number;
  unit: string;
  quantity: number;
  description?: string;
  imageUri: string;
}

const PostRedeem = memo((props: Props) => {
  const dispatch = useDispatch();
  const scrollRef = useRef<KeyboardAwareScrollView>() as MutableRefObject<KeyboardAwareScrollView>;
  const modalRef = useRef<Modalize>() as MutableRefObject<Modalize>;
  const dataImage = useRef<string>('');

  const units = useSelector((state: RootState) =>
    state.values.units?.asMutable(),
  );
  const branches = useSelector((state: RootState) =>
    state.values.branches?.asMutable(),
  );

  const pickerUnits = useMemo(() => {
    return units ? units.map((i) => ({ label: i, value: i })) : [];
  }, [units]);

  const onSubmit = useCallback((values: Form, helper: FormikHelpers<Form>) => {
    const onSuccess = () =>
      PopupPrototype.alert(_t('success'), _t('createRedeemSuccess'), [
        {
          text: _t('ok'),
          onPress: () => props.navigation.pop(),
        },
      ]);
    const onError = () => PopupPrototype.alert(_t('unsuccess'), _t('error'));
    const payload: any = {
      ...values,
      image: StringPrototype.genBase64(dataImage.current),
      index: 0,
    };
    dispatch(redeemActions.createRedeem.start(payload, onSuccess, onError));
  }, []);

  const form = useFormik<Form>({
    initialValues: {
      name: '',
      branch: [],
      code: '',
      unit: '',
      description: '',
      imageUri: '',
      point: 0,
      quantity: 0,
    },
    onSubmit,
    validateOnMount: false,
    validateOnBlur: false,
    validateOnChange: false,
    enableReinitialize: true,
    validationSchema: () =>
      yup.object().shape({
        name: validateRequireField(_t('redeemName')),
        branch: validateRequireField(_t('branch')),
        unit: validateRequireField(_t('unit')),
        imageUri: validateRequireField(_t('image')),
        point: validateRequireField(_t('point')),
        quantity: validateRequireField(_t('quantity')),
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
    let result = branch.map((i, index) => {
      const find = branches?.find((item) => item.id === i);
      return find;
    });

    return result.map((i) => i.name).join(', ');
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
          <UIKit.Text style={styles.label}>{_t('redeemName')}</UIKit.Text>
          <UIKit.FormField
            style={styles.input}
            formID="name"
            form={form}
            autoFocus
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
            <UIKit.Text style={styles.label}>{_t('promoCode')}</UIKit.Text>
            <UIKit.FormField
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
            <UIKit.Text style={styles.label}>{_t('redeemPoints')}</UIKit.Text>
            <UIKit.FormField
              formID="point"
              keyboardType="numeric"
              form={form}
              style={styles.input}
              clearButtonMode="never"
            />
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
            <UIKit.FormError message={form.errors.unit} />
          </UIKit.View>
        </UIKit.View>
        <UIKit.FormError message={form.errors.point || form.errors.unit} />

        <UIKit.View style={styles.section}>
          <UIKit.Text style={styles.label}>{_t('quantity')}</UIKit.Text>
          <UIKit.FormField
            formID="quantity"
            keyboardType="numeric"
            form={form}
            style={styles.input}
            clearButtonMode="never"
          />
          <UIKit.FormError message={form.errors.quantity} />
        </UIKit.View>
        <UIKit.FormError />

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
          title={_t('createRedeem')}
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

export default PostRedeem;
