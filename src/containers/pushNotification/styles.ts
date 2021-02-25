import { colors, constants, variants } from '@values';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  done: {
    color: colors.button,
    marginHorizontal: constants.halfPadding,
    fontSize: variants.title,
  },
  label: {
    fontWeight: 'bold',
    marginTop: constants.dfPadding,
    marginBottom: constants.halfPadding,
  },
  input: {
    borderRadius: 2,
    backgroundColor: colors.black1,
    padding: constants.halfPadding,
    fontSize: variants.title,
    lineHeight: variants.title * 1.3,
  },
  content: {
    borderRadius: 2,
    backgroundColor: colors.black1,
    padding: constants.halfPadding,
    minHeight: 100,
    textAlignVertical: 'top',
    fontSize: variants.normal,
    lineHeight: variants.normal * 1.3,
  },
  note: {
    fontSize: variants.subTitle,
    color: colors.gray,
    marginTop: constants.dfPadding,
  },
  btn: {
    margin: constants.dfPadding,
  },
});
