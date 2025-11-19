import {
  chakra,
  useRecipe,
  type HTMLChakraProps,
  type JsxStyleProps,
  type RecipeProps,
} from '@chakra-ui/react';
import {
  Children,
  cloneElement,
  isValidElement,
  useMemo,
  type ReactElement,
  type RefAttributes,
} from 'react';

export interface GroupProps
  extends HTMLChakraProps<'div', RecipeProps<'group'>> {
  /**
   * The `alignItems` style property
   */
  align?: JsxStyleProps['alignItems'] | undefined;
  /**
   * The `justifyContent` style property
   */
  justify?: JsxStyleProps['justifyContent'] | undefined;
  /**
   * The `flexWrap` style property
   */
  wrap?: JsxStyleProps['flexWrap'] | undefined;
  /**
   * A function that determines if a child should be skipped
   */
  skip?: (child: ReactElement) => boolean | undefined;
}

export function Group(props: GroupProps & RefAttributes<HTMLDivElement>) {
  const recipe = useRecipe({ key: 'group' });
  const [variantProps, otherProps] = recipe.splitVariantProps(props);
  const styles = recipe(variantProps);

  const {
    align = 'center',
    justify = 'flex-start',
    children,
    wrap,
    skip,
    ref,
    ...rest
  } = otherProps;

  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const _children = useMemo(() => {
    const childArray = Children.toArray(children).filter(isValidElement);

    if (childArray.length === 1) {
      return childArray;
    }

    const validChildArray = childArray.filter(child => !skip?.(child));
    const validChildCount = validChildArray.length;

    if (validChildCount === 1) {
      return childArray;
    }

    return childArray.map(child => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
      const childProps = child.props as any;

      if (skip?.(child)) {
        return child;
      }

      const index = validChildArray.indexOf(child);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return cloneElement(child, {
        ...childProps,
        'data-group-item': '',
        'data-first': dataAttr(index === 0),
        'data-last': dataAttr(index === validChildCount - 1),
        'data-between': dataAttr(index > 0 && index < validChildCount - 1),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        style: {
          '--group-count': validChildCount,
          '--group-index': index,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          ...(childProps?.style ?? {}),
        },
      });
    });
    // eslint-disable-next-line react-hooks/preserve-manual-memoization
  }, [children, skip]);

  return (
    <chakra.div
      css={styles}
      ref={ref}
      alignItems={align}
      justifyContent={justify}
      flexWrap={wrap}
      {...rest}
    >
      {_children}
    </chakra.div>
  );
}

type Booleanish = boolean | 'true' | 'false';

function dataAttr(condition: boolean | undefined) {
  return (condition ? '' : undefined) as Booleanish;
}
