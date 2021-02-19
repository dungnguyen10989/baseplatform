import React, { PureComponent, memo, useCallback, ComponentType } from 'react';
import {
  StyleSheet,
  Animated,
  Dimensions,
  ScaledSize,
  ListRenderItemInfo,
  StyleProp,
  ViewStyle,
  Modal,
} from 'react-native';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';

import { constants } from '@values';
import FlatList from './flattList';
import View from './view';

interface State {
  width: number;
}

const mediaSize = 60;
const defaultCount = 5;

interface IShimmerProps {
  mediaCircle?: boolean;
}

interface _I_KIT_Shimmer {
  count?: number;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

class ShimmerItem extends PureComponent<IShimmerProps, State> {
  animated: any[];
  unmounted = false;

  constructor(props: IShimmerProps) {
    super(props);
    this.animated = [];
    this.state = {
      width: Dimensions.get('window').width,
    };
  }
  componentDidMount() {
    this.runAvatarReverseAnimated();
    Dimensions.addEventListener('change', this.onDimensionChange);
  }

  componentWillUnmount() {
    Dimensions.removeEventListener('change', this.onDimensionChange);
    this.unmounted = true;
  }

  onDimensionChange = (_DIMS: { window: ScaledSize; screen: ScaledSize }) => {
    if (this.state.width !== _DIMS.window.width) {
      this.setState({ width: _DIMS.window.width });
    }
  };

  runAvatarReverseAnimated() {
    if (Array.isArray(this.animated) && this.animated.length > 0) {
      Animated.stagger(400, [
        this.animated[0].getAnimated(), // image left
        Animated.parallel(
          this.animated
            .slice(0, this.animated.length)
            .map((animate) =>
              animate && animate.getAnimated ? animate.getAnimated() : null,
            ),
          { stopTogether: false },
        ),
      ]).start(() => {
        if (!this.unmounted) {
          this.runAvatarReverseAnimated();
        }
      });
    }
  }

  _renderRowsReverse(number: number) {
    const shimmerRows: Array<JSX.Element> = [];
    for (let index = 0; index < number; index++) {
      const fullWidth = this.state.width - mediaSize - constants.dfPadding * 3;
      const width = index === 0 ? fullWidth * 0.8 : fullWidth;
      shimmerRows.push(
        <ShimmerPlaceHolder
          key={`loading-${index}`}
          ref={this.addRef}
          width={width}
          style={styles.line}
          duration={1500}
        />,
      );
    }
    return <View>{shimmerRows}</View>;
  }

  addRef = (ref: any) => this.animated.push(ref);

  render() {
    return (
      <>
        <View style={styles.container}>
          <ShimmerPlaceHolder
            ref={this.addRef}
            width={mediaSize}
            height={mediaSize}
            style={[
              styles.media,
              this.props.mediaCircle ? styles.circle : undefined,
            ]}
          />
          {this._renderRowsReverse(3)}
        </View>
      </>
    );
  }
}

const Shimmer = (props: _I_KIT_Shimmer) => {
  const renderItem = useCallback(
    (info: ListRenderItemInfo<number>) => (
      <ShimmerItem mediaCircle={info.index % 2 === 0} />
    ),
    [],
  );

  const divider = useCallback(() => <View marginT={constants.dfPadding} />, []);

  return (
    <FlatList
      data={Array.from<number>({ length: props.count || defaultCount })}
      renderItem={renderItem}
      ItemSeparatorComponent={divider}
      scrollEnabled={false}
      contentContainerStyle={props.contentContainerStyle}
    />
  );
};

(Shimmer as ComponentType<_I_KIT_Shimmer>).defaultProps = {
  count: defaultCount,
};

export default memo(Shimmer);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: constants.dfPadding,
  },
  line: {
    marginBottom: 7,
  },
  media: {
    marginRight: constants.dfPadding,
    borderRadius: 2,
  },
  circle: {
    borderRadius: mediaSize / 2,
  },
});
