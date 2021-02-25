import React, { createRef, PureComponent } from 'react';
import { FlatList, FlatListProps } from 'react-native';
import { IModifiersTest } from 'custom-ui-kit';
import { getOr } from 'lodash/fp';

export interface IFlatListProps extends FlatListProps<any>, IModifiersTest {
  keyEx?: string;
  separator?: JSX.Element;
  empty?: JSX.Element;
}

export default class _FlatList extends PureComponent<IFlatListProps> {
  onEndReachedCalledDuringMomentum = true;

  listRef = createRef<FlatList<any>>();

  _keyExtractor = (item: any, index: number): string => {
    if (this.props.keyExtractor) {
      return this.props.keyExtractor(item, index);
    }
    return getOr(`key-${index}`, 'keyEx', item);
  };

  scrollToEnd = (
    params?: { animated?: boolean | null | undefined } | undefined,
  ) => {
    if (this.listRef.current) {
      return this.listRef.current.scrollToEnd(params);
    }
  };

  scrollToIndex = (params: {
    animated?: boolean | null | undefined;
    index: number;
    viewOffset?: number | undefined;
    viewPosition?: number | undefined;
  }) => {
    if (this.listRef.current) {
      return this.listRef.current.scrollToIndex(params);
    }
  };

  scrollToItem = (params: {
    animated?: boolean | null | undefined;
    item: any;
    viewPosition?: number | undefined;
  }) => {
    if (this.listRef.current) {
      return this.listRef.current.scrollToItem(params);
    }
  };

  scrollToOffset = (params: {
    animated?: boolean | null | undefined;
    offset: number;
  }) => {
    if (this.listRef.current) {
      return this.listRef.current.scrollToOffset(params);
    }
  };

  flashScrollIndicators = () => {
    if (this.listRef.current) {
      return this.listRef.current.flashScrollIndicators();
    }
  };

  recordInteraction = () => {
    if (this.listRef.current) {
      this.listRef.current.recordInteraction();
    }
  };

  getNativeScrollRef = () => {
    if (this.listRef.current) {
      return this.listRef.current.getNativeScrollRef();
    }
  };

  getScrollResponder = () => {
    if (this.listRef.current) {
      return this.listRef.current.getScrollResponder();
    }
  };

  getScrollableNode = () => {
    if (this.listRef.current) {
      return this.listRef.current.getScrollableNode();
    }
  };

  onMomentumScrollBegin = () => {
    this.onEndReachedCalledDuringMomentum = false;
  };

  onEndReached = (e: any) => {
    if (!this.onEndReachedCalledDuringMomentum && e.distanceFromEnd > 0) {
      this.props.onEndReached?.(e);
      this.onEndReachedCalledDuringMomentum = true;
    }
  };

  renderSeparator = () => {
    const { separator, ItemSeparatorComponent } = this.props;
    if (separator) {
      return separator;
    }
    return ItemSeparatorComponent ? <ItemSeparatorComponent /> : null;
  };

  renderEmpty = () => this.props.separator;

  render() {
    return (
      <FlatList
        {...this.props}
        keyExtractor={this._keyExtractor}
        ref={this.listRef}
        ItemSeparatorComponent={this.renderSeparator}
        onMomentumScrollBegin={this.onMomentumScrollBegin}
        ListEmptyComponent={
          this.props.separator
            ? this.renderEmpty()
            : this.props.ListEmptyComponent
        }
      />
    );
  }
}

(_FlatList as React.ComponentType<IFlatListProps>).defaultProps = {
  onEndReachedThreshold: 0.1,
};
