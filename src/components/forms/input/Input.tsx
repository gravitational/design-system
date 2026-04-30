import {
  chakra,
  Input as ChakraInput,
  type IconProps,
  type InputProps as ChakraInputProps,
} from '@chakra-ui/react';
import type { ComponentType, RefAttributes } from 'react';

import { WarningCircleIcon } from '../../../icons';

export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends Omit<ChakraInputProps, 'size'> {
  size?: InputSize;
  /** Whether this input has an error. */
  hasError?: boolean;
  /** Optional icon to render on the left side of the input. */
  icon?: ComponentType<IconProps>;
}

const ICON_SIZE: Record<InputSize, string> = {
  sm: '16px',
  md: '18px',
  lg: '20px',
};

export function Input({
  icon: IconComponent,
  hasError,
  size = 'md',
  disabled,
  ...rest
}: InputProps & RefAttributes<HTMLInputElement>) {
  if (!IconComponent && !hasError) {
    return (
      <ChakraInput
        size={size}
        disabled={disabled}
        aria-invalid={hasError}
        {...rest}
      />
    );
  }

  const iconSize = ICON_SIZE[size];

  return (
    <chakra.div
      display="inline-flex"
      position="relative"
      verticalAlign="middle"
    >
      {IconComponent && (
        <chakra.span
          position="absolute"
          insetStart="17px"
          top={0}
          bottom={0}
          display="flex"
          alignItems="center"
          pointerEvents="none"
          color={disabled ? 'text.disabled' : 'text.slightlyMuted'}
        >
          <IconComponent role="graphics-symbol" boxSize={iconSize} />
        </chakra.span>
      )}
      <ChakraInput
        size={size}
        disabled={disabled}
        aria-invalid={hasError}
        data-has-icon={IconComponent ? '' : undefined}
        {...rest}
      />
      {hasError && (
        <chakra.span
          position="absolute"
          insetEnd="9px"
          top={0}
          bottom={0}
          display="flex"
          alignItems="center"
          pointerEvents="none"
          color="interactive.solid.danger.default"
          aria-label="Error"
          role="graphics-symbol"
        >
          <WarningCircleIcon boxSize={iconSize} />
        </chakra.span>
      )}
    </chakra.div>
  );
}
