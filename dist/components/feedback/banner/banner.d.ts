import { type HTMLChakraProps, type SlotRecipeProps } from '@chakra-ui/react';
import type { FC, RefAttributes } from 'react';
export type BannerRootProps = HTMLChakraProps<'div', SlotRecipeProps<'banner'>>;
export type BannerContentProps = HTMLChakraProps<'div'>;
export type BannerTitleProps = HTMLChakraProps<'div'>;
export type BannerDescriptionProps = HTMLChakraProps<'div'>;
export type BannerIndicatorProps = HTMLChakraProps<'div'>;
export declare const Banner: {
    Root: FC<BannerRootProps & RefAttributes<HTMLDivElement>>;
    Content: FC<BannerContentProps & RefAttributes<HTMLDivElement>>;
    Title: FC<BannerTitleProps & RefAttributes<HTMLDivElement>>;
    Description: FC<BannerDescriptionProps & RefAttributes<HTMLDivElement>>;
    Indicator: FC<BannerIndicatorProps & RefAttributes<HTMLDivElement>>;
};
