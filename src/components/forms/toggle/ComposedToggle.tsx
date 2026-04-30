import { Switch as ChakraSwitch } from '@chakra-ui/react';
import type { ReactNode, RefAttributes } from 'react';

export type ToggleSize = 'sm' | 'lg';

export interface ComposedToggleProps extends Omit<
  ChakraSwitch.RootProps,
  'checked' | 'onCheckedChange' | 'size' | 'variant' | 'children' | 'label'
> {
  size?: ToggleSize;
  /** Whether the toggle is toggled. */
  isToggled: boolean;
  /** Called when the toggle is clicked. */
  onToggle: () => void;
  /** Label rendered next to the toggle. */
  label?: ReactNode;
}

export function ComposedToggle({
  isToggled,
  onToggle,
  label,
  disabled,
  ...rest
}: ComposedToggleProps & RefAttributes<HTMLLabelElement>) {
  return (
    <ChakraSwitch.Root
      checked={isToggled}
      onCheckedChange={onToggle}
      disabled={disabled}
      {...rest}
    >
      <ChakraSwitch.HiddenInput data-testid="toggle" />
      <ChakraSwitch.Control>
        <ChakraSwitch.Thumb />
      </ChakraSwitch.Control>
      {label != null && <ChakraSwitch.Label>{label}</ChakraSwitch.Label>}
    </ChakraSwitch.Root>
  );
}
