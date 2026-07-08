import { type HTMLChakraProps, type RecipeProps } from '@chakra-ui/react';
import type { RefAttributes } from 'react';
export type ShimmerBoxProps = HTMLChakraProps<'div', RecipeProps<'shimmerBox'>>;
/**
 * A loading skeleton box to be used as a placeholder for content being loaded.
 */
export declare function ShimmerBox({ css, ...props }: ShimmerBoxProps & RefAttributes<HTMLDivElement>): import("react/jsx-runtime").JSX.Element;
