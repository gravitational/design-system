import {
  chakra,
  type HTMLChakraProps,
  type SystemStyleObject,
} from '@chakra-ui/react';
import type { Ref } from 'react';

export interface FlexOptions {
  /**
   * The CSS align-items property
   * @type SystemStyleObject['alignItems']
   * @default 'stretch'
   */
  align?: SystemStyleObject['alignItems'] | undefined;
  /**
   * The CSS justify-content property
   * @type SystemStyleObject['justifyContent']
   * @default 'flex-start'
   */
  justify?: SystemStyleObject['justifyContent'] | undefined;
  /**
   * The CSS flex-wrap property
   * @type SystemStyleObject['flexWrap']
   * @default 'nowrap'
   */
  wrap?: SystemStyleObject['flexWrap'] | undefined;
  /**
   * The CSS flex-direction property
   * @type SystemStyleObject['flexDirection']
   * @default 'row'
   */
  direction?: SystemStyleObject['flexDirection'] | undefined;
  /**
   * The CSS flex-basis property
   * @type SystemStyleObject['flexBasis']
   * @default 'auto'
   */
  basis?: SystemStyleObject['flexBasis'] | undefined;
  /**
   * The CSS flex-grow property
   * @type SystemStyleObject['flexGrow']
   * @default 0
   */
  grow?: SystemStyleObject['flexGrow'] | undefined;
  /**
   * The CSS flex-shrink property
   * @type SystemStyleObject['flexShrink']
   * @default 1
   */
  shrink?: SystemStyleObject['flexShrink'] | undefined;
  /**
   * If `true`, the flex container will be `display: inline-flex`
   * @default false
   */
  inline?: boolean | undefined;
}

export interface FlexProps extends HTMLChakraProps<'div', FlexOptions> {
  ref?: Ref<HTMLDivElement>;
}

export function Flex(props: FlexProps) {
  const {
    direction,
    align,
    justify,
    wrap,
    basis,
    grow,
    shrink,
    inline,
    ...rest
  } = props;

  return (
    <chakra.div
      {...rest}
      css={{
        display: inline ? 'inline-flex' : 'flex',
        flexDirection: direction,
        alignItems: align,
        justifyContent: justify,
        flexWrap: wrap,
        flexBasis: basis,
        flexGrow: grow,
        flexShrink: shrink,
        ...props.css,
      }}
    />
  );
}
