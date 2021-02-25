import { colors, constants } from '@values';
import { StyleSheet } from 'react-native';

const imageSize = constants.width / 2 - constants.dfPadding * 1.25;

export const styles = StyleSheet.create({
  section: {
    marginTop: constants.dfPadding,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: constants.halfPadding / 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flex: {
    flex: 1,
  },
  divider: {
    width: constants.halfPadding,
  },

  input: {
    backgroundColor: colors.black1,
    borderRadius: 2,
    padding: constants.halfPadding,
    height: 44,
    justifyContent: 'center',
  },
  amount: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  amountContainer: {
    flex: 1,
    marginRight: 5,
  },
  desWrapper: {
    backgroundColor: colors.black1,
    borderRadius: 2,
    padding: constants.halfPadding,
    justifyContent: 'center',
  },
  des: {
    minHeight: 100,
  },
  imageWrapper: {
    alignSelf: 'flex-start',
  },
  image: {
    width: imageSize,
    height: imageSize,
    backgroundColor: colors.black1,
    borderRadius: 2,
  },
  camera: {
    fontSize: 30,
    color: colors.skyBlue,
    position: 'absolute',
    bottom: 5,
    right: 5,
  },
  btnWrapper: {
    borderTopWidth: 1,
    borderColor: colors.borders,
    padding: constants.halfPadding,
    paddingVertical: 3,
  },
  btn: {
    marginVertical: constants.dfPadding,
  },
});
