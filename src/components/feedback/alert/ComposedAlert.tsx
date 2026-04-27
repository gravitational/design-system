import {
  Alert as ChakraAlert,
  Spinner,
  type SlotRecipeProps,
} from '@chakra-ui/react';
import type { ComponentType, ReactNode, RefAttributes } from 'react';

import {
  CheckCircleIcon,
  InfoIcon,
  WarningCircleIcon,
  WarningIcon,
  type IconProps,
} from '../../../icons';
import { CloseButton } from '../../button';

export type AlertKind = Extract<SlotRecipeProps<'alert'>['kind'], string>;

const defaultIconByKind: Record<
  Exclude<AlertKind, 'cta'>,
  ComponentType<IconProps>
> = {
  success: CheckCircleIcon,
  danger: WarningCircleIcon,
  warning: WarningIcon,
  info: InfoIcon,
  neutral: InfoIcon,
};

export interface ComposedAlertProps extends Omit<
  ChakraAlert.RootProps,
  'title' | 'content'
> {
  /** The title text of the alert. */
  title?: ReactNode;
  /** Additional description text displayed below the title. */
  description?: ReactNode;
  /** Optional custom icon. */
  icon?: ComponentType<IconProps>;
  /** If `true`, replaces the icon with a loading spinner. */
  isLoading?: boolean;
  /** If `true`, displays a close button. */
  isClosable?: boolean;
  /** Called when the close button is clicked. */
  onClose?: () => void;
}

/**
 * Displays an in-page notice to communicate a message, error, or status.
 */
export function ComposedAlert({
  kind,
  title,
  description,
  icon: Icon,
  isLoading,
  isClosable,
  onClose,
  children,
  ref,
  ...rest
}: ComposedAlertProps & RefAttributes<HTMLDivElement>) {
  const kindKey = (kind ?? 'danger') as AlertKind;
  const IconForKind =
    Icon ?? (kindKey === 'cta' ? undefined : defaultIconByKind[kindKey]);
  return (
    <ChakraAlert.Root ref={ref} kind={kind} {...rest}>
      {isLoading ? (
        <ChakraAlert.Indicator>
          <Spinner size="sm" />
        </ChakraAlert.Indicator>
      ) : IconForKind ? (
        <ChakraAlert.Indicator>
          <IconForKind />
        </ChakraAlert.Indicator>
      ) : null}
      <ChakraAlert.Content>
        {title && <ChakraAlert.Title>{title}</ChakraAlert.Title>}
        {description && (
          <ChakraAlert.Description>{description}</ChakraAlert.Description>
        )}
        {children}
      </ChakraAlert.Content>
      {isClosable && <CloseButton onClick={onClose} />}
    </ChakraAlert.Root>
  );
}
