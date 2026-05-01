import { chakra } from '@chakra-ui/react';
import type { ComponentProps } from 'react';

export const Subtitle = chakra('p', {
  variants: {
    /**
     * The size of the subtitle.
     */
    size: {
      sm: { textStyle: 'subtitle3' },
      md: { textStyle: 'subtitle2' },
      lg: { textStyle: 'subtitle1' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export type SubtitleProps = ComponentProps<typeof Subtitle>;

export const Subtitle1 = (props: SubtitleProps) => (
  <Subtitle size="lg" {...props} />
);

export const Subtitle2 = (props: SubtitleProps) => (
  <Subtitle size="md" {...props} />
);

export const Subtitle3 = (props: SubtitleProps) => (
  <Subtitle size="sm" {...props} />
);
