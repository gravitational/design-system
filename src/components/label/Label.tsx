import { chakra } from '@chakra-ui/react';

export type LabelKind =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger';

export const Label = chakra('div', {
  base: {
    boxSizing: 'border-box',
    borderRadius: 'full',
    display: 'inline-block',
    fontSize: 0,
    fontWeight: 'medium',
    px: 2,
    py: 0,
    verticalAlign: 'middle',
    overflow: 'hidden',
  },
  variants: {
    kind: {
      primary: {
        bg: 'interactive.solid.primary.default',
        color: 'text.primaryInverse',
      },
      secondary: {
        bg: 'interactive.tonal.neutral.0',
        color: 'text.main',
        fontWeight: 'regular',
      },
      success: {
        bg: 'interactive.solid.success.default',
        color: 'text.primaryInverse',
      },
      warning: {
        bg: 'interactive.solid.alert.default',
        color: 'text.primaryInverse',
      },
      danger: {
        bg: 'interactive.solid.danger.default',
        color: 'text.primaryInverse',
      },
    },
  },
  defaultVariants: {
    kind: 'primary',
  },
});

export type LabelProps = React.ComponentProps<typeof Label>;
