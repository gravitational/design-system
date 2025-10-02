import { Button, type ButtonProps } from './Button';

export type IconButtonProps = Omit<
  ButtonProps,
  'block' | 'compact' | 'inputAlignment' | 'loadingText' | 'spinnerPlacement'
>;

export function IconButton(props: IconButtonProps) {
  return <Button px="0" py="0" _icon={{ fontSize: '1.2em' }} {...props} />;
}
