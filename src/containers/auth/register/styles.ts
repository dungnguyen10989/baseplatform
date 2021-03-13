import { colors, constants, variants } from '@values';
import { StyleSheet } from 'react-native';

const abSize = 120;

export default StyleSheet.create({
  bg: {
    flex: 1,
    width: constants.width,
    height: constants.height,
  },
  container: {
    flex: 1,
    flexGrow: 1,
    paddingHorizontal: constants.dfPadding,
    justifyContent: 'center',
  },
  logo: {
    height: 80,
    width: constants.width,
    alignSelf: 'center',
    marginTop: constants.dfPadding,
  },
  form: {
    // flex: 1,
    marginTop: -100,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: colors.skyBlue,
    padding: constants.dfPadding,
    paddingTop: abSize / 2,
  },
  absolute: {
    width: abSize,
    height: abSize,
    borderRadius: abSize / 2,
    backgroundColor: colors.skyBlue,
    position: 'absolute',
    top: -abSize / 2,
    left: constants.width / 2 - abSize / 2 - constants.halfPadding,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slogan: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: variants.h4,
  },
  error: {
    marginTop: 5,
  },
  inputContainer: {
    marginTop: constants.dfPadding * 1.5,
  },
  input: {
    backgroundColor: colors.transparent,
    paddingVertical: constants.halfPadding,
    borderBottomWidth: 1,
    borderColor: colors.skyBlue5,
    marginTop: constants.halfPadding,
  },
  icon: {
    width: 24,
    height: 24,
  },
  buttonLogin: {
    marginTop: constants.dfPadding,
  },
  buttonBack: {
    borderWidth: 1,
    borderColor: colors.textColor,
    marginTop: constants.dfPadding,
  },
  control: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: constants.dfPadding * 2,
  },
  separator: {
    height: '100%',
    width: 1,
    backgroundColor: colors.white,
  },
  controlBtn: {
    flex: 1,
    justifyContent: 'center',
  },
  privacyWrapper: {
    width: '100%',
    flexDirection: 'row',
    marginTop: constants.dfPadding,
  },
  checkbox: {
    width: variants.title,
    height: variants.title,
    marginTop: constants.isAndroid ? 6 : 3,
  },
  privacyText: {
    flex: 1,
    marginLeft: constants.dfPadding,
  },
});
