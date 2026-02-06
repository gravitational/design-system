import { Checkbox as ArkCheckbox } from '@ark-ui/react';
import {
  chakra,
  Checkbox as ChakraCheckbox,
  useCheckboxContext,
  useCheckboxStyles,
  type CheckboxIndicatorProps,
  type CheckboxRootProps,
  type HTMLChakraProps,
} from '@chakra-ui/react';
import type { FC, RefAttributes } from 'react';

import { Checkmark } from '../../utilities/checkmark/Checkmark';

export const CheckboxRoot = ChakraCheckbox.Root;
export { type CheckboxRootProps };

function CheckboxIndicator(
  props: CheckboxIndicatorProps & RefAttributes<SVGSVGElement>
) {
  const { checked, indeterminate, ...rest } = props;

  const api = useCheckboxContext();
  const styles = useCheckboxStyles();

  if (checked && api.checked) {
    return (
      <chakra.svg asChild {...rest} css={[styles.indicator, props.css]}>
        {checked}
      </chakra.svg>
    );
  }

  if (indeterminate && api.indeterminate) {
    return (
      <chakra.svg asChild {...rest} css={[styles.indicator, props.css]}>
        {indeterminate}
      </chakra.svg>
    );
  }

  return (
    <Checkmark
      checked={api.checked}
      indeterminate={api.indeterminate}
      disabled={api.disabled}
      unstyled
      {...rest}
      data-part="indicator"
      css={[styles.indicator, props.css]}
    />
  );
}

export type CheckboxGroupProps = HTMLChakraProps<
  'div',
  ArkCheckbox.GroupBaseProps
>;

const CheckboxGroup = chakra(
  ArkCheckbox.Group,
  {
    base: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
    },
  },
  { forwardAsChild: true }
) as FC<CheckboxGroupProps>;

export const Checkbox = {
  Root: CheckboxRoot,
  HiddenInput: ChakraCheckbox.HiddenInput,
  Control: ChakraCheckbox.Control,
  Label: ChakraCheckbox.Label,
  Indicator: CheckboxIndicator,
  Group: CheckboxGroup,
};
