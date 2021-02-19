import React, { createRef, PureComponent, RefObject } from 'react';
import { ScrollView, ScrollViewProps } from 'react-native';
import { IModifiersTest } from 'custom-ui-kit';

interface IScrollViewProps extends ScrollViewProps, IModifiersTest {}

export default class _ScrollView extends PureComponent<IScrollViewProps> {
  static defaultProps = {
    keyboardShouldPersistTaps: 'handled',
  };

  listRef: RefObject<ScrollView>;

  constructor(props: IScrollViewProps) {
    super(props);
    this.listRef = createRef<ScrollView>();
  }

  scrollToEnd = (params?: { animated: boolean }) => {
    if (this.listRef.current) {
      return this.listRef.current.scrollToEnd(params);
    }
  };

  scrollTo = (
    y?:
      | number
      | {
          x?: number | undefined;
          y?: number | undefined;
          animated?: boolean | undefined;
        }
      | undefined,
    x?: number | undefined,
    animated?: boolean | undefined,
  ) => {
    if (this.listRef.current) {
      return this.listRef.current.scrollTo(y, x, animated);
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

  render() {
    return <ScrollView {...this.props} ref={this.listRef} />;
  }
}
