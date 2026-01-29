import {
  chakra,
  type HTMLChakraProps,
  type SystemStyleObject,
} from '@chakra-ui/react';
import type { RefAttributes } from 'react';

export interface GridBaseOptions {
  /**
   * The CSS `grid-template-columns` property
   * @type SystemStyleObject['gridTemplateColumns']
   * @default 'none'
   */
  templateColumns?: SystemStyleObject['gridTemplateColumns'] | undefined;
  /**
   * The CSS `grid-auto-flow` property
   * @type SystemStyleObject['gridAutoFlow']
   * @default 'row'
   */
  autoFlow?: SystemStyleObject['gridAutoFlow'] | undefined;
  /**
   * The CSS `grid-auto-rows` property
   * @type SystemStyleObject['gridAutoRows']
   * @default 'auto'
   */
  autoRows?: SystemStyleObject['gridAutoRows'] | undefined;
  /**
   * The CSS `grid-auto-columns` property
   * @type SystemStyleObject['gridAutoColumns']
   * @default 'auto'
   */
  autoColumns?: SystemStyleObject['gridAutoColumns'] | undefined;
  /**
   * The CSS `grid-template-rows` property
   * @type SystemStyleObject['gridTemplateRows']
   * @default ''
   */
  templateRows?: SystemStyleObject['gridTemplateRows'] | undefined;
  /**
   * The CSS `grid-template-areas` property
   * @type SystemStyleObject['gridTemplateAreas']
   * @default 0
   */
  templateAreas?: SystemStyleObject['gridTemplateAreas'] | undefined;
  /**
   * The CSS `grid-column` property
   * @type SystemStyleObject['gridColumn']
   * @default 'auto'
   */
  column?: SystemStyleObject['gridColumn'] | undefined;
  /**
   * The CSS `grid-row` property
   * @type SystemStyleObject['gridRow']
   * @default 'auto'
   */
  row?: SystemStyleObject['gridRow'] | undefined;
  /**
   * If `true`, the flex container will be `display: inline-flex`
   * @default false
   */
  inline?: boolean | undefined;
}

export type GridProps = HTMLChakraProps<'div', GridBaseOptions>;

export function Grid(props: GridProps & RefAttributes<HTMLDivElement>) {
  const {
    templateColumns,
    autoFlow,
    autoRows,
    autoColumns,
    templateRows,
    templateAreas,
    column,
    row,
    inline,
    ...rest
  } = props;

  return (
    <chakra.div
      {...rest}
      css={{
        display: inline ? 'inline-grid' : 'grid',
        gridTemplateAreas: templateAreas,
        gridAutoColumns: autoColumns,
        gridColumn: column,
        gridRow: row,
        gridAutoFlow: autoFlow,
        gridAutoRows: autoRows,
        gridTemplateRows: templateRows,
        gridTemplateColumns: templateColumns,
        ...props.css,
      }}
    />
  );
}
