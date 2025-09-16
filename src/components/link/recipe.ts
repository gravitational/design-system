import { defineRecipe } from '@chakra-ui/react';

export const linkRecipe = defineRecipe({
  className: 'teleport-link',
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    outline: 'none',
    color: 'link',
    gap: '1.5',
    cursor: 'pointer',
    borderRadius: 'l1',
  },
  variants: {
    variant: {
      underline: {
        textDecoration: 'underline',
        textUnderlineOffset: '3px',
        textDecorationColor: 'currentColor/20',
      },
      plain: {
        _hover: {
          textDecoration: 'underline',
        },
      },
    },
  },
  defaultVariants: {
    variant: 'plain',
  },
});
