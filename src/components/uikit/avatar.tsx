import React, { PureComponent } from 'react';
import {
  StyleSheet,
  LayoutChangeEvent,
  StyleProp,
  ViewStyle,
  GestureResponderEvent,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage, {
  Source,
  OnLoadEvent,
  OnProgressEvent,
  ImageStyle,
} from 'react-native-fast-image';
import { IModifiersTest } from 'custom-ui-kit';
import { colors } from '@values';

const defaultSize = 50;

export interface Props extends IModifiersTest {
  source: Source | number;
  size?: number;
  borderWidth?: number;
  borderColor?: string;
  style?: StyleProp<ImageStyle>;
  tintColor?: number | string;
  fallback?: boolean;
  containerStyle?: ViewStyle;

  onPress?: (e: GestureResponderEvent) => void | undefined;
  onLoadStart?(): void;
  onProgress?(event: OnProgressEvent): void;
  onLoad?(event: OnLoadEvent): void;
  onError?(): void;
  onLoadEnd?(): void;
  onLayout?: (event: LayoutChangeEvent) => void;
}

interface State {
  style: StyleProp<ViewStyle>;
}

export default class Avatar extends PureComponent<Props, State> {
  static defaultProps = {
    size: defaultSize,
    borderWidth: 3,
    borderColor: colors.white,
  };

  static getDerivedStateFromProps(nextProps: Props) {
    const {
      containerStyle,
      size = defaultSize,
      borderColor,
      borderWidth,
    } = nextProps;

    return {
      ...containerStyle,
      width: size,
      height: size,
      borderRadius: size / 2,
      borderColor,
      borderWidth,
      overflow: 'hidden',
    };
  }

  constructor(props: Props) {
    super(props);
    this.state = {
      style: {},
    };
  }

  render() {
    const {
      containerStyle,
      size,
      borderColor,
      borderWidth,
      onPress,
      style,
      ...rest
    } = this.props;
    const { style: stateStyle } = this.state;

    if (!onPress) {
      return (
        <View style={[containerStyle, stateStyle]}>
          <FastImage {...rest} style={[styles.image, style]} />
        </View>
      );
    }

    return (
      <TouchableOpacity onPress={onPress} style={[containerStyle, stateStyle]}>
        <FastImage {...rest} style={[styles.image, style]} />
      </TouchableOpacity>
    );
  }
}

// const FuncComponent = memo((Props: Props) => {
//   const {
//     containerStyle,
//     size,
//     borderColor,
//     borderWidth,
//     onPress,
//     style,
//     ...rest
//   } = Props;
//   const _size = size || defaultSize;

//   const _style: StyleProp<ViewStyle> = {
//     width: _size,
//     height: _size,
//     borderRadius: _size / 2,
//     borderColor,
//     borderWidth,
//     overflow: 'hidden',
//   };

//   if (!onPress) {
//     return (
//       <View style={[containerStyle, _style]}>
//         <FastImage {...rest} style={[styles.image, style]} />
//       </View>
//     );
//   }

//   return (
//     <TouchableOpacity onPress={onPress} style={[containerStyle, _style]}>
//       <FastImage {...rest} style={[styles.image, style]} />
//     </TouchableOpacity>
//   );
// });

// (FuncComponent as ComponentType<Props>).defaultProps = {
//   size: defaultSize,
//   borderWidth: 3,
//   borderColor: COLORS.white,
// };

// export default FuncComponent;

const styles = StyleSheet.create({
  image: {
    flex: 1,
    width: undefined,
    height: undefined,
  },
});
