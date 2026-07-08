import { type HTMLChakraProps, type JsxStyleProps, type RecipeProps } from '@chakra-ui/react';
import { type ReactElement, type RefAttributes } from 'react';
export interface GroupProps extends HTMLChakraProps<'div', RecipeProps<'group'>> {
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
export declare function Group(props: GroupProps & RefAttributes<HTMLDivElement>): import("react/jsx-runtime").JSX.Element;
