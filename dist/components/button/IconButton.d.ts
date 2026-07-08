import { type HTMLChakraProps, type RecipeProps } from '@chakra-ui/react';
import type { RefAttributes } from 'react';
export type IconButtonProps = HTMLChakraProps<'button', RecipeProps<'iconButton'>>;
/**
 * A button with an icon.
 */
export declare function IconButton({ css, type, ...props }: IconButtonProps & RefAttributes<HTMLButtonElement>): import("react/jsx-runtime").JSX.Element;
