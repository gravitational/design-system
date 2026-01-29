import type { RefAttributes } from 'react';
import { useFormState } from 'react-hook-form';

import { Button, type ButtonProps } from '../../button';

export function SubmitButton(
  props: Omit<ButtonProps, 'type'> & RefAttributes<HTMLButtonElement>
) {
  const state = useFormState();

  const disabled = props.disabled == true ? true : !state.isValid;

  return (
    <Button
      type="submit"
      loading={state.isSubmitting}
      {...props}
      disabled={disabled}
    />
  );
}
