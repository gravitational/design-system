import { type RecipeProps } from '@chakra-ui/react';
import { type RefAttributes } from 'react';
import { type GroupProps } from '../group/Group';
export type ButtonGroupProps = Omit<GroupProps, 'fill'> & RecipeProps<'button'>;
export declare function ButtonGroup(props: ButtonGroupProps & RefAttributes<HTMLDivElement>): import("react/jsx-runtime").JSX.Element;
