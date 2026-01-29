import { useCallback } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { z } from 'zod';

import { Box, Form, Stack, SubmitButton, useForm } from '../../../..';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  githubHandle: z
    .string()
    .min(2, 'GitHub handle must be at least 2 characters')
    .regex(/^[^@].*$/, 'GitHub handle cannot start with @'),
});

type FormSchema = z.infer<typeof schema>;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function FormExample() {
  const form = useForm(
    {
      defaultValues: {
        name: '',
        githubHandle: '',
      },
    },
    schema
  );

  const handleSubmit = useCallback<SubmitHandler<FormSchema>>(
    async data => {
      // eslint-disable-next-line no-console
      console.log('Form submitted with data:', data);

      await sleep(5000);

      form.reset();

      setTimeout(() => {
        form.setFocus('name');
      }, 50);
    },
    [form]
  );

  return (
    <Form form={form} onSubmit={handleSubmit}>
      <Stack gap={4}>
        <form.FieldInput name="name" label="Name" required />
        <form.FieldInput
          name="githubHandle"
          label="GitHub Handle"
          helperText="Do not include the @"
          required
        />

        <Box>
          <SubmitButton>Submit</SubmitButton>
        </Box>
      </Stack>
    </Form>
  );
}
