import React, { memo } from 'react';
import DatabaseProvider from '@nozbe/watermelondb/DatabaseProvider';
import database from './src/database';
import MainStackScreen from './src/navigator';
import { ConsoleUtils } from '@utils/log';

export default memo(() => {
  ConsoleUtils.l('[START APP] db', database);
  return (
    <DatabaseProvider database={database}>
      <MainStackScreen />
    </DatabaseProvider>
  );
});
