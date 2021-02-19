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
  private listRef = createRef<FlatList<any>>();

  private _keyExtractor = (item: any, index: number): string => {
    if (this.props.keyExtractor) {
      return this.props.keyExtractor(item, index);
    }
    return getOr(`key-${index}`, 'keyEx', item);
  };

  public scrollToEnd = (
    params?: { animated?: boolean | null | undefined } | undefined,
  ) => {
    if (this.listRef.current) {
      return this.listRef.current.scrollToEnd(params);
    }
  };

  public scrollToIndex = (params: {
    animated?: boolean | null | undefined;
    index: number;
    viewOffset?: number | undefined;
    viewPosition?: number | undefined;
  }) => {
    if (this.listRef.current) {
      return this.listRef.current.scrollToIndex(params);
    }
  };

  public scrollToItem = (params: {
    animated?: boolean | null | undefined;
    item: any;
    viewPosition?: number | undefined;
  }) => {
    if (this.listRef.current) {
      return this.listRef.current.scrollToItem(params);
    }
  };

  public scrollToOffset = (params: {
    animated?: boolean | null | undefined;
    offset: number;
  }) => {
    if (this.listRef.current) {
      return this.listRef.current.scrollToOffset(params);
    }
  };

  public flashScrollIndicators = () => {
    if (this.listRef.current) {
      return this.listRef.current.flashScrollIndicators();
    }
  };

  public recordInteraction = () => {
    if (this.listRef.current) {
      this.listRef.current.recordInteraction();
    }
  };

  public getNativeScrollRef = () => {
    if (this.listRef.current) {
      return this.listRef.current.getNativeScrollRef();
    }
  };

  public getScrollResponder = () => {
    if (this.listRef.current) {
      return this.listRef.current.getScrollResponder();
    }
  };

  public getScrollableNode = () => {
    if (this.listRef.current) {
      return this.listRef.current.getScrollableNode();
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
