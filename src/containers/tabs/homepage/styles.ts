import { colors, constants, variants } from '@values';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  topButtons: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    marginRight: constants.dfPadding,
  },
  topButtonText: {
    color: colors.brightRed,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  titleStatistical: {
    fontWeight: 'bold',
    marginHorizontal: constants.dfPadding,
    marginVertical: constants.halfPadding,
  },
  title: {
    fontWeight: 'bold',
  },
  errorFetching: {
    flex: 1,
    justifyContent: 'center',
  },
  itemWrapper: {
    backgroundColor: colors.black2,
  },
  carouselItem: {
    borderWidth: 1,
    borderColor: colors.borders,
    borderRadius: 10,
  },
  item: {
    flexDirection: 'row',
    paddingHorizontal: constants.halfPadding,
    paddingVertical: constants.dfPadding,
  },
  line: {
    height: 1,
    backgroundColor: colors.textColor,
    marginHorizontal: constants.halfPadding,
  },
  titleLeft: {
    fontWeight: 'bold',
    flex: 1,
  },
  contactWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: constants.dfPadding,
    paddingVertical: constants.halfPadding,
    borderColor: colors.button,
    borderWidth: 2,
    borderRadius: constants.halfPadding,
    marginHorizontal: constants.dfPadding,
    marginVertical: constants.halfPadding,
  },
  contactIcon: {
    width: 24,
    height: 24,
    marginRight: constants.dfPadding,
  },
  contactTitle: {
    fontWeight: 'bold',
    color: colors.button,
    flex: 1,
  },
  carousel: {
    marginTop: constants.dfPadding * 1.5,
  },
  sliderImage: {
    width: constants.width * 0.8,
    height: constants.width * 0.4,
    borderRadius: 10,
    backgroundColor: colors.black1,
  },
  productName: {
    color: colors.white,
    fontWeight: 'bold',
    position: 'absolute',
    left: constants.dfPadding,
    right: constants.dfPadding,
    bottom: constants.dfPadding,
    textAlign: 'center',
  },
});
