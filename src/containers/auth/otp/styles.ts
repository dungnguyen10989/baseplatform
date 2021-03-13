import { colors, constants } from '@values';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  bg: {
    flex: 1,
    width: constants.width,
    height: constants.height,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  logo: {
    height: 80,
    width: constants.width,
    alignSelf: 'center',
    marginVertical: constants.dfPadding * 2,
  },
  top: {
    flex: 3,
    justifyContent: 'center',
  },
  bottom: {
    flex: 7,
  },
  error: {
    marginTop: 5,
  },
  inputWrapper: {
    borderBottomWidth: 1,
    borderColor: colors.borders,
    alignItems: 'center',
  },
  input: {
    margin: constants.halfPadding,
    textAlign: 'center',
    width: '100%',
    fontSize: 36,
    letterSpacing: constants.halfPadding,
    color: colors.black,
  },
  placeholder: {
    color: colors.placeholderTextColor,
  },
  resend: {
    alignSelf: 'flex-end',
    color: colors.button,
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
    borderColor: colors.white,
    borderRadius: 30,
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
});
