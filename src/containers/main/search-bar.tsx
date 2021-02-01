import React from 'react';
import { StyleSheet, View, TextInput, Image } from 'react-native';
import { IStack } from 'screen-props';
import { _mBaseSchema, _mFeatureSchema, _mPostSchema } from '@database/schemas';
import { _t } from '@i18n';
import { assets } from '@assets';
import { colors, dims, variants } from '@values';

interface Props extends IStack {}

const SearchBar = React.memo((props: Props) => {
  const params = props.route.params;
  const { defaultValue, onChangeText, onSubmitEditing, headerHeight } =
    params || {};

  const headerStyle = {
    height: headerHeight,
  };

  return (
    <View style={[styles.wrapper, headerStyle]}>
      <View style={styles.container}>
        <Image source={assets.icon.ic_search} style={styles.icon} />

        <TextInput
          style={styles.input}
          defaultValue={defaultValue}
          onChangeText={onChangeText}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
          blurOnSubmit
          keyboardType="url"
          clearButtonMode="never"
          onSubmitEditing={onSubmitEditing}
        />
      </View>
    </View>
  );
});

export default SearchBar;

const styles = StyleSheet.create({
  wrapper: {
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: 'flex-end',
    backgroundColor: colors.white,
    paddingBottom: dims.halfPadding,
    paddingHorizontal: dims.dfPadding,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 4,
    borderColor: colors.silver,
    paddingHorizontal: dims.halfPadding,
  },
  input: {
    flex: 1,
    paddingVertical: dims.halfPadding,
    color: colors.gray,
  },
  icon: {
    width: variants.h4,
    height: variants.h4,
    marginRight: dims.halfPadding,
    tintColor: colors.silver,
  },
});
