import { VStack } from '@chakra-ui/react';
import type { Meta } from '@storybook/react-vite';

import { ComposedField, Field, Input } from '../../../../components';

const meta = {
  component: ComposedField,
} satisfies Meta<typeof ComposedField>;

export default meta;

export function Required() {
  return (
    <ComposedField label="Required field" required helperText="Helper text">
      <Input placeholder="Input" />
    </ComposedField>
  );
}
Required.tags = ['!dev'];

export function WithError() {
  return (
    <ComposedField label="Invalid field" invalid errorMessage="Error message">
      <Input hasError />
    </ComposedField>
  );
}
WithError.tags = ['!dev'];

export function ComposeExample() {
  return (
    <VStack gap={4} align="stretch" minW="320px">
      <Field.Root required>
        <Field.Label>
          Required field <Field.RequiredIndicator />
        </Field.Label>
        <Input placeholder="Input" />
        <Field.HelperText>Helper text</Field.HelperText>
      </Field.Root>
      <Field.Root invalid>
        <Field.Label>Invalid field</Field.Label>
        <Input hasError />
        <Field.ErrorText>Error message</Field.ErrorText>
      </Field.Root>
    </VStack>
  );
}
ComposeExample.tags = ['!dev'];
