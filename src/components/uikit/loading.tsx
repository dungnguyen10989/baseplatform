import React, { ComponentType, memo, useCallback } from 'react';
import { StyleSheet, View, Modal } from 'react-native';
import { IModifiersTest } from 'custom-ui-kit';

import Shimmer from './shimmer';

interface ILoadingProps extends IModifiersTest {
  enable?: boolean;
  placeholderCount?: number;
}

const FuncComponent = (props: ILoadingProps) => {
  const { placeholderCount, enable } = props;

  const onRequestClose = useCallback(() => {}, []);

  if (!enable) {
    return null;
  }

  return (
    <Modal transparent onRequestClose={onRequestClose}>
      <View style={styles.container}>
        <Shimmer count={placeholderCount} />
      </View>
    </Modal>
  );
};

(FuncComponent as ComponentType<ILoadingProps>).defaultProps = {
  enable: true,
};

export default memo(FuncComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
