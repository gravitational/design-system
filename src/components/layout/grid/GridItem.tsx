import {
  chakra,
  type BoxProps,
  type ConditionalValue,
  type SystemStyleObject,
} from '@chakra-ui/react';
import { useMemo, type RefAttributes } from 'react';

import { compact } from '../../../utils/compact';
import { mapObject } from '../../../utils/walkObject';

export interface GridItemProps extends BoxProps {
  /**
   * The CSS `grid-area` property
   * @type SystemStyleObject['gridArea']
   * @default 'auto'
   */
  area?: SystemStyleObject['gridArea'] | undefined;
  /**
   * The column span of the grid item
   * @type number | 'auto'
   * @default 'auto'
   */
  colSpan?: ConditionalValue<number | 'auto'> | undefined;
  /**
   * The CSS `grid-column-start` property
   * @type SystemStyleObject['gridColumnStart']
   * @default 'auto'
   */
  colStart?: SystemStyleObject['gridColumnStart'] | undefined;
  /**
   * The CSS `grid-column-end` property
   * @type SystemStyleObject['gridColumnEnd']
   * @default 'auto'
   */
  colEnd?: SystemStyleObject['gridColumnEnd'] | undefined;
  /**
   * The CSS `grid-row-start` property
   * @type SystemStyleObject['gridRowStart']
   * @default 'auto'
   */
  rowStart?: SystemStyleObject['gridRowStart'] | undefined;
  /**
   * The CSS `grid-row-end` property
   * @type SystemStyleObject['gridRowEnd']
   * @default 'auto'
   */
  rowEnd?: SystemStyleObject['gridRowEnd'] | undefined;
  /**
   * The row span of the grid item
   * @type number | 'auto'
   * @default 'auto'
   */
  rowSpan?: ConditionalValue<number | 'auto'> | undefined;
}

export function GridItem(props: GridItemProps & RefAttributes<HTMLDivElement>) {
  const {
    area,
    colSpan,
    colStart,
    colEnd,
    rowEnd,
    rowSpan,
    rowStart,
    ref,
    ...rest
  } = props;

  const styles = useMemo(
    () =>
      compact({
        gridArea: area,
        gridColumn: spanFn(colSpan),
        gridRow: spanFn(rowSpan),
        gridColumnStart: colStart,
        gridColumnEnd: colEnd,
        gridRowStart: rowStart,
        gridRowEnd: rowEnd,
      }),
    [area, colSpan, colStart, colEnd, rowEnd, rowSpan, rowStart]
  );

  return <chakra.div ref={ref} css={[styles, props.css]} {...rest} />;
}

function spanFn(span?: ConditionalValue<number | 'auto'>) {
  return mapObject(span, value =>
    value === 'auto' ? 'auto' : `span ${value}/span ${value}`
  );
}
