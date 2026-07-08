import { type BoxProps, type ConditionalValue, type SystemStyleObject } from '@chakra-ui/react';
import { type RefAttributes } from 'react';
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
export declare function GridItem(props: GridItemProps & RefAttributes<HTMLDivElement>): import("react/jsx-runtime").JSX.Element;
