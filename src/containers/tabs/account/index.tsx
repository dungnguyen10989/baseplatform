import React, { memo, useEffect } from 'react';
import { UIKit } from '@uikit';
import { PopupPrototype } from '@utils';
import styles from './styles';
import { _t } from '@i18n';
import { fetchAPI } from '@services';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import { IStack } from 'screen-props';

interface Props extends IStack {}

const Account = memo((props: Props) => {
  const db = useDatabase();

  useEffect(() => {
    PopupPrototype.showOverlay();
    fetchAPI('get/auth/app/shop/info', 'post').then((val) => {
      PopupPrototype.dismissOverlay();
    });
  }, []);

  return (
    <UIKit.Container>
      <UIKit.ButtonText title="aaaaaa" underline />
    </UIKit.Container>
  );
});

export default Account;
