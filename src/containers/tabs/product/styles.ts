import { colors, constants, variants } from '@values';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  postProduct: {
    alignSelf: 'flex-end',
  },
  errorFetching: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: constants.halfPadding,
    fontSize: variants.title,
  },
  list: {
    paddingBottom: constants.dfPadding,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 2,
    borderColor: colors.gray,
    padding: constants.halfPadding,
  },
  itemLeft: {
    marginRight: constants.halfPadding,
  },
  itemRight: {
    marginLeft: constants.halfPadding,
  },
  img: {
    width: constants.width / 2 - constants.dfPadding * 3,
    height: constants.width / 2 - constants.dfPadding * 5,
  },
  name: {
    // color: colors.brightRed,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
  },
  amount: {
    color: colors.brightRed,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
