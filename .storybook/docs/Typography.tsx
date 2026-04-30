import { chakra, Heading, type HeadingProps } from '@chakra-ui/react';

const headingSizeStyles = {
  '3xl': {
    fontSize: '32px',
    lineHeight: '40px',
    fontWeight: '500',
  },
  '2xl': {
    fontSize: '24px',
    lineHeight: '32px',
    fontWeight: '500',
  },
  xl: {
    fontSize: '18px',
    lineHeight: '24px',
    fontWeight: '500',
  },
  lg: {
    fontSize: '14px',
    lineHeight: '20px',
    fontWeight: '600',
  },
  md: {
    fontSize: '12px',
    lineHeight: '20px',
    fontWeight: '500',
    letterSpacing: '0.03px',
    textTransform: 'uppercase',
  },
  sm: {
    fontSize: '16px',
    lineHeight: '24px',
    fontWeight: '400',
    letterSpacing: '0.024px',
  },
  xs: {
    fontSize: '14px',
    lineHeight: '20px',
    fontWeight: '400',
    letterSpacing: '0.014px',
  },
} as const;

export interface DocsHeadingProps extends Omit<HeadingProps, 'size'> {
  size?: keyof typeof headingSizeStyles;
}

export function DocsHeading({ size = '2xl', ...props }: DocsHeadingProps) {
  return <Heading {...headingSizeStyles[size]} {...props} />;
}

export const DocsText = chakra('p');
