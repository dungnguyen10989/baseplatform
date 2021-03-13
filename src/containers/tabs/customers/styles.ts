import { colors, constants, variants } from '@values';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  topButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: constants.dfPadding,
    alignItems: 'flex-start',
  },
  header: {
    backgroundColor: colors.primaryGreen,
    marginTop: constants.quarterPadding,
    marginHorizontal: constants.quarterPadding,
    borderRadius: 1,
  },
  headerLabel: {
    flex: 1,
    textTransform: 'capitalize',
    fontSize: variants.title,
  },
  topButton: {
    flex: 1,
  },
  topButtonText: {
    color: colors.brightRed,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorFetching: {
    flex: 1,
    justifyContent: 'center',
  },
  item: {
    paddingHorizontal: constants.dfPadding,
    paddingVertical: constants.halfPadding,
  },
  title: {
    fontWeight: 'bold',
    margin: constants.dfPadding,
    marginBottom: constants.halfPadding,
    fontSize: variants.title,
  },
  itemTitle: {
    fontWeight: 'bold',
  },
  amount: {
    color: colors.brightRed,
  },
  right: {
    alignItems: 'flex-end',
  },
});
