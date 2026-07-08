import { Card as ChakraCard } from '@chakra-ui/react';
import type { ReactNode, RefAttributes } from 'react';
export interface ComposedCardProps extends Omit<ChakraCard.RootProps, 'title' | 'content'> {
    /** Optional title rendered in the card header. */
    title?: ReactNode;
    /** Optional content rendered in the card footer. */
    footer?: ReactNode;
}
export declare function ComposedCard({ title, footer, children, ref, ...rest }: ComposedCardProps & RefAttributes<HTMLDivElement>): import("react/jsx-runtime").JSX.Element;
