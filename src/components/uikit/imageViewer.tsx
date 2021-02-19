import React, { useState, memo, useCallback } from 'react';
import { Text, StyleSheet } from 'react-native';
import ImageViewer, {
  ImageViewerPropsDefine,
} from 'react-native-image-zoom-viewer';

import { IModifiersTest } from 'custom-ui-kit';

import { constants, colors } from '@values';

const bottom = constants.bottomSpace + 10;

interface IImageViewerProps extends IModifiersTest, ImageViewerPropsDefine {}

const FuncComponent = (props: IImageViewerProps) => {
  const [index, setIndex] = useState(0);
  const { imageUrls } = props;

  const onChange = useCallback((_index?: number) => setIndex(_index || 0), []);

  const renderIndicator = useCallback((current?: number, len?: number) => {
    return (
      <Text style={styles.indicator}>
        {current}/{len}
      </Text>
    );
  }, []);

  const len = Array.isArray(imageUrls) ? imageUrls.length : 0;

  return (
    <ImageViewer
      {...props}
      index={len > 1 ? index : undefined}
      onChange={len > 1 ? onChange : undefined}
      renderIndicator={len > 1 ? renderIndicator : undefined}
      saveToLocalByLongPress={false}
      maxOverflow={len > 1 ? undefined : 0}
      imageUrls={imageUrls}
      enablePreload
    />
  );
};

export default memo(FuncComponent);

const styles = StyleSheet.create({
  indicator: {
    color: colors.white,
    zIndex: 1000,
    position: 'absolute',
    bottom,
    alignSelf: 'center',
    fontSize: 20,
  },
});
