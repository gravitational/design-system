import {
  createSlotRecipeContext,
  type HTMLChakraProps,
  type SlotRecipeProps,
} from '@chakra-ui/react';
import type { FC, RefAttributes } from 'react';

const { withProvider, withContext } = createSlotRecipeContext({
  key: 'banner',
});

export type BannerRootProps = HTMLChakraProps<'div', SlotRecipeProps<'banner'>>;
export type BannerContentProps = HTMLChakraProps<'div'>;
export type BannerTitleProps = HTMLChakraProps<'div'>;
export type BannerDescriptionProps = HTMLChakraProps<'div'>;
export type BannerIndicatorProps = HTMLChakraProps<'div'>;

const BannerRoot = withProvider<HTMLDivElement, BannerRootProps>('div', 'root');
const BannerContent = withContext<HTMLDivElement, BannerContentProps>(
  'div',
  'content'
);
const BannerTitle = withContext<HTMLDivElement, BannerTitleProps>(
  'div',
  'title'
);
const BannerDescription = withContext<HTMLDivElement, BannerDescriptionProps>(
  'div',
  'description'
);
const BannerIndicator = withContext<HTMLDivElement, BannerIndicatorProps>(
  'div',
  'indicator'
);

export const Banner: {
  Root: FC<BannerRootProps & RefAttributes<HTMLDivElement>>;
  Content: FC<BannerContentProps & RefAttributes<HTMLDivElement>>;
  Title: FC<BannerTitleProps & RefAttributes<HTMLDivElement>>;
  Description: FC<BannerDescriptionProps & RefAttributes<HTMLDivElement>>;
  Indicator: FC<BannerIndicatorProps & RefAttributes<HTMLDivElement>>;
} = {
  Root: BannerRoot,
  Content: BannerContent,
  Title: BannerTitle,
  Description: BannerDescription,
  Indicator: BannerIndicator,
};
