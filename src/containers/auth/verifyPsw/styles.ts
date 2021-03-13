import { colors, constants, variants } from '@values';
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
  top: {
    flex: 3,
    justifyContent: 'center',
  },
  bottom: {
    flex: 7,
  },
  header: {
    color: colors.white,
    fontSize: variants.title,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  logo: {
    height: 80,
    width: constants.width,
    alignSelf: 'center',
    marginVertical: constants.dfPadding * 2,
  },
  form: {
    marginTop: 50,
  },
  error: {
    marginTop: 5,
  },
  input: {
    backgroundColor: colors.white5,
    marginTop: constants.dfPadding,
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
