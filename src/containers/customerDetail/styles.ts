import { colors, constants, variants } from '@values';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  errorFetching: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    margin: constants.dfPadding,
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontWeight: 'bold',
    fontSize: variants.title,
    marginLeft: constants.halfPadding,
  },
  itemTitle: {
    fontWeight: 'bold',
  },
  itemUpdated: {
    color: colors.gray,
  },
  amount: {
    color: colors.brightRed,
  },
  right: {
    alignItems: 'flex-end',
  },
  row: {
    flexDirection: 'row',
  },
  below: {
    marginTop: constants.quarterPadding,
  },
  item: {
    paddingHorizontal: constants.dfPadding,
    paddingVertical: constants.halfPadding,
    borderTopWidth: 1,
    borderColor: colors.borders,
  },
  itemLeft: {
    flex: 7,
  },
  itemRight: {
    flex: 3,
    textAlign: 'right',
  },
});
