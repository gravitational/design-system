import { Tooltip as ChakraTooltip, Portal } from '@chakra-ui/react';
import { type ReactNode, type Ref, type RefObject } from 'react';

export interface TooltipProps extends ChakraTooltip.RootProps {
  showArrow?: boolean;
  portalled?: boolean;
  portalRef?: RefObject<HTMLElement>;
  content: ReactNode;
  contentProps?: ChakraTooltip.ContentProps;
  disabled?: boolean;
  ref?: Ref<HTMLDivElement>;
}

export function Tooltip({
  showArrow = true,
  children,
  disabled,
  portalled = true,
  content,
  contentProps,
  portalRef,
  ref,
  ...rest
}: TooltipProps) {
  if (disabled || !content) {
    return children;
  }

  return (
    <ChakraTooltip.Root {...rest}>
      <ChakraTooltip.Trigger asChild>{children}</ChakraTooltip.Trigger>
      <Portal disabled={!portalled} container={portalRef}>
        <ChakraTooltip.Positioner>
          <ChakraTooltip.Content ref={ref} {...contentProps}>
            {showArrow && (
              <ChakraTooltip.Arrow>
                <ChakraTooltip.ArrowTip />
              </ChakraTooltip.Arrow>
            )}
            {content}
          </ChakraTooltip.Content>
        </ChakraTooltip.Positioner>
      </Portal>
    </ChakraTooltip.Root>
  );
}
