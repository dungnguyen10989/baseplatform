import { validatePhone } from '@utils';
import { HttpResponse } from '@services';
import { _t } from '@i18n';

export const generatePathAndBody = (username: string) => {
  const isPhone = validatePhone(username);
  const pathForgot = isPhone ? `sendOTP/${username}` : 'auth/email/sendcode/v2';
  const pathRegister = isPhone ? `sendOTP/${username}` : 'auth/email/verify/v2';
  const body = isPhone ? { username } : { email: username };

  return {
    isPhone,
    pathForgot,
    pathRegister,
    pathCheckDuplicate: 'auth/checkduplicate',
    body,
  };
};

export const generateResponseMessage = (
  val: HttpResponse,
  isPhone: boolean,
  requestType: 'forgot' | 'register',
) => {
  let mess = '';
  if (requestType === 'forgot') {
    if (isPhone) {
      mess = !val.success
        ? _t('otpPhoneFailure')
        : !val.data?.isDuplicate
        ? _t('phoneNotExists')
        : '';
    } else {
      mess = val.success
        ? val.data?.verify_code
          ? ''
          : _t('emailNotExists')
        : _t('otpEmailFailure');
    }
  } else {
    if (isPhone) {
      mess = !val.success
        ? _t('otpPhoneFailure')
        : !val.data?.isDuplicate
        ? _t('phoneNotExists')
        : '';
    } else {
      mess = val.success
        ? val.data?.verify_code
          ? ''
          : _t('emailNotExists')
        : _t('otpEmailFailure');
    }
  }

  return {
    message: mess,
    code: val?.data?.verify_code,
  };
};
