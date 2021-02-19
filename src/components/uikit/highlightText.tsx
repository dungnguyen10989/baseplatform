import React, { ComponentType, memo, PropsWithChildren, useMemo } from 'react';
import {
  Text,
  TextProps,
  StyleSheet,
  StyleProp,
  TextStyle,
} from 'react-native';
import {
  IModifiersSpacing,
  IModifiersStyling,
  IModifiersText,
  IModifiersLayout,
  IModifiersTest,
} from 'custom-ui-kit';

import { destructPropsToStyle } from './helper';
import { colors } from '@values';

export interface ITextProps
  extends TextProps,
    IModifiersSpacing,
    IModifiersStyling,
    IModifiersText,
    IModifiersLayout,
    IModifiersTest {
  text?: string;
  highlight?: string;
  highlightStyle?: StyleProp<TextStyle>;
  highlightBold?: boolean;
  quote?: 'single' | 'double' | undefined;
  sections?: Array<string | null | undefined>;
  highlightIndex?: number;
}

const FuncComponent = (props: PropsWithChildren<ITextProps>) => {
  const {
    highlight = '',
    highlightBold,
    highlightStyle,
    quote,
    text = '',
    sections,
    highlightIndex,
    ...rest
  } = props;
  const { _styles, _props } = useMemo(() => destructPropsToStyle(rest), [rest]);
  const style = StyleSheet.flatten([
    _styles.textStyle,
    _styles.stylingStyle,
    _styles.spacingStyle,
    _styles.layoutStyle,
  ]);

  const boldStyle: TextStyle = highlightBold ? { fontWeight: 'bold' } : {};

  const index = text.indexOf(highlight);

  if (index === -1) {
    return <Text {..._props} style={style} />;
  }

  let _sections: Array<string | null | undefined> = [];
  let _index: number;

  const mapHighlight = (n: string) => {
    return quote === 'single' ? `'${n}'` : quote === 'double' ? `"${n}"` : n;
  };

  if (Array.isArray(sections) && highlightIndex) {
    _sections = sections;
    _index = highlightIndex;
  } else {
    _sections = [
      text.substring(0, index),
      mapHighlight(highlight),
      text.substring(index + highlight.length),
    ];
    _index = 1;
  }

  delete props.children;

  return (
    <Text>
      {_sections.map((section, i) => {
        const s = i === _index ? [style, highlightStyle, boldStyle] : style;
        return (
          <Text {..._props} style={s} key={`highlight-text-${i}`}>
            {i === _index ? mapHighlight(section || '') : section}{' '}
          </Text>
        );
      })}
    </Text>
  );
};

(FuncComponent as ComponentType<ITextProps>).defaultProps = {
  color: colors.textColor,
  highlightBold: true,
};

export default memo(FuncComponent);
