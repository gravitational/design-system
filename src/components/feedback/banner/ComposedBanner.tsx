import { Spinner, type SlotRecipeProps } from '@chakra-ui/react';
import type { ComponentType, ReactNode, RefAttributes } from 'react';

import {
  CheckCircleIcon,
  InfoIcon,
  WarningCircleIcon,
  WarningIcon,
  type IconProps,
} from '../../../icons';
import { CloseButton } from '../../button';

import { Banner, type BannerRootProps } from './banner';

export type BannerKind = Extract<SlotRecipeProps<'banner'>['kind'], string>;

const defaultIconByKind: Record<
  Exclude<BannerKind, 'primary'>,
  ComponentType<IconProps>
> = {
  success: CheckCircleIcon,
  danger: WarningCircleIcon,
  warning: WarningIcon,
  info: InfoIcon,
  neutral: InfoIcon,
};

export interface ComposedBannerProps extends Omit<
  BannerRootProps,
  'title' | 'content'
> {
  /** The title text of the banner. */
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
 * Displays a banner at the top of the page.
 */
export function ComposedBanner({
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
}: ComposedBannerProps & RefAttributes<HTMLDivElement>) {
  const kindKey = (kind ?? 'danger') as BannerKind;
  const IconForKind =
    Icon ?? (kindKey === 'primary' ? undefined : defaultIconByKind[kindKey]);
  return (
    <Banner.Root ref={ref} kind={kind} {...rest}>
      {isLoading ? (
        <Banner.Indicator>
          <Spinner size="sm" />
        </Banner.Indicator>
      ) : IconForKind ? (
        <Banner.Indicator>
          <IconForKind />
        </Banner.Indicator>
      ) : null}
      <Banner.Content>
        {title && <Banner.Title>{title}</Banner.Title>}
        {description && <Banner.Description>{description}</Banner.Description>}
        {children}
      </Banner.Content>
      {isClosable && <CloseButton onClick={onClose} />}
    </Banner.Root>
  );
}
