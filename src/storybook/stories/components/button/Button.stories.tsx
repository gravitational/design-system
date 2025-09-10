import { Box, Grid, HStack, VStack } from '@chakra-ui/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';

import {
  Button,
  ButtonBorder,
  ButtonGroup,
  ButtonLink,
  ButtonSecondary,
  ButtonText,
  ButtonWarning,
  ButtonWarningBorder,
} from '../../../../components';
import { CaretDownIcon, HorseIcon, TrashIcon } from '../../../../icons';

const meta = {
  title: 'Components/Buttons/Button',
  component: Button,
  args: {
    disabled: false,
  },
  argTypes: {
    loadingText: {
      control: 'text',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ButtonStory: Story = {
  name: 'Button',
  args: {
    children: 'Button',
    onClick: fn(),
  },
  parameters: {
    layout: 'centered',
  },
  play: async ({ args, canvas, userEvent }) => {
    const button = canvas.getByRole('button');

    await userEvent.click(button);

    await expect(args.onClick).toHaveBeenCalled();
  },
};

export function DisabledButtons() {
  return (
    <Grid gridTemplateColumns="repeat(6, auto)" gap={2} w="fit-content">
      <Button disabled fill="filled">
        Primary Filled
      </Button>
      <Button disabled fill="minimal">
        Primary Minimal
      </Button>
      <Button disabled fill="border">
        Primary Border
      </Button>
      <Button disabled fill="filled" intent="success">
        Success Filled
      </Button>
      <Button disabled fill="minimal" intent="success">
        Success Minimal
      </Button>
      <Button disabled fill="border" intent="success">
        Success Border
      </Button>
      <Button disabled fill="filled" intent="neutral">
        Neutral Filled
      </Button>
      <Button disabled fill="minimal" intent="neutral">
        Neutral Minimal
      </Button>
      <Button disabled fill="border" intent="neutral">
        Neutral Border
      </Button>
      <Button disabled fill="filled" intent="danger">
        Danger Filled
      </Button>
      <Button disabled fill="minimal" intent="danger">
        Danger Minimal
      </Button>
      <Button disabled fill="border" intent="danger">
        Danger Border
      </Button>
    </Grid>
  );
}

DisabledButtons.tags = ['!dev'];

export const Disabled: Story = {
  name: 'Disabled',
  args: {
    children: 'Button',
    disabled: true,
    onClick: fn(),
  },
  parameters: {
    layout: 'centered',
    controls: {
      disable: true,
    },
  },
  play: async ({ args, canvas, userEvent }) => {
    const button = canvas.getByRole('button', { name: 'Primary Filled' });

    await userEvent.click(button);

    await expect(args.onClick).not.toHaveBeenCalled();

    const buttons = canvas.getAllByRole('button');

    for (const button of buttons) {
      await expect(button).toBeDisabled();
    }
  },
  render: DisabledButtons,
};

export const LoadingStory: Story = {
  name: 'Loading State',
  args: {
    children: 'Button',
    loading: true,
  },
  parameters: {
    layout: 'centered',
    controls: {
      disable: true,
    },
  },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: 'Saving...' });

    await expect(button).toBeDisabled();

    await expect(button).toHaveAttribute('data-loading');
  },
  render: Loading,
};

export function Loading() {
  return (
    <ButtonGroup>
      <Button loading>Save</Button>

      <Button loading loadingText="Saving...">
        Save
      </Button>
    </ButtonGroup>
  );
}

Loading.tags = ['!dev'];

export function SpinnerPlacement() {
  return (
    <ButtonGroup>
      <Button loading loadingText="Saving..." spinnerPlacement="start">
        Save
      </Button>

      <Button loading loadingText="Saving..." spinnerPlacement="end">
        Save
      </Button>
    </ButtonGroup>
  );
}

SpinnerPlacement.parameters = {
  controls: {
    disable: true,
  },
};

export function Sizes() {
  return (
    <ButtonGroup>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      <Button size="xl">Extra Large</Button>
    </ButtonGroup>
  );
}

Sizes.parameters = {
  controls: {
    disable: true,
  },
};

export function Intents() {
  return (
    <ButtonGroup>
      <Button intent="primary">Primary</Button>
      <Button intent="success">Success</Button>
      <Button intent="neutral">Neutral</Button>
      <Button intent="danger">Danger</Button>
    </ButtonGroup>
  );
}

Intents.parameters = {
  controls: {
    disable: true,
  },
};

export function Icon() {
  return (
    <ButtonGroup>
      <Button size="sm">
        <HorseIcon />
        Button
      </Button>
      <Button>
        <HorseIcon />
        Button
      </Button>
      <Button size="lg">
        <HorseIcon />
        Button
      </Button>
      <ButtonWarning>
        <TrashIcon />
        Delete
      </ButtonWarning>
    </ButtonGroup>
  );
}

Icon.parameters = {
  controls: {
    disable: true,
  },
};

export function Group() {
  return (
    <HStack gap={8}>
      <ButtonGroup>
        <Button intent="neutral">Cancel</Button>
        <Button intent="primary">Save</Button>
      </ButtonGroup>

      <ButtonGroup attached>
        <Button fill="border" intent="neutral">
          Actions
        </Button>
        <Button fill="border" intent="neutral" px={2}>
          <CaretDownIcon />
        </Button>
      </ButtonGroup>
    </HStack>
  );
}

Group.parameters = {
  controls: {
    disable: true,
  },
};

export function Fill() {
  return (
    <Grid gridTemplateColumns="repeat(6, auto)" gap={2} w="fit-content">
      <Button fill="filled">Primary Filled</Button>
      <Button fill="minimal">Primary Minimal</Button>
      <Button fill="border">Primary Border</Button>
      <Button fill="filled" intent="success">
        Success Filled
      </Button>
      <Button fill="minimal" intent="success">
        Success Minimal
      </Button>
      <Button fill="border" intent="success">
        Success Border
      </Button>
      <Button fill="filled" intent="neutral">
        Neutral Filled
      </Button>
      <Button fill="minimal" intent="neutral">
        Neutral Minimal
      </Button>
      <Button fill="border" intent="neutral">
        Neutral Border
      </Button>
      <Button fill="filled" intent="danger">
        Danger Filled
      </Button>
      <Button fill="minimal" intent="danger">
        Danger Minimal
      </Button>
      <Button fill="border" intent="danger">
        Danger Border
      </Button>
    </Grid>
  );
}

Fill.parameters = {
  controls: {
    disable: true,
  },
};

export function InputAlignment() {
  return (
    <VStack align="start">
      <Button inputAlignment size="sm">
        Small with input alignment
      </Button>
      <Button inputAlignment size="md">
        Medium with input alignment
      </Button>
      <Button inputAlignment size="lg">
        Large with input alignment
      </Button>
      <Button inputAlignment size="xl">
        Extra large with input alignment
      </Button>
    </VStack>
  );
}

InputAlignment.parameters = {
  controls: {
    disable: true,
  },
};

export const LinkStory: Story = {
  name: 'Links',
  parameters: {
    layout: 'centered',
    controls: {
      disable: true,
    },
  },
  play: async ({ canvas }) => {
    const links = canvas.getAllByRole('link');

    for (const link of links) {
      await expect(link).toHaveAttribute('href', 'https://goteleport.com');
    }
  },
  render: Links,
};

export function Links() {
  return (
    <ButtonGroup>
      <Button asChild>
        <a href="https://goteleport.com" target="_blank" rel="noreferrer">
          Link as a button
        </a>
      </Button>
      <ButtonSecondary asChild>
        <a href="https://goteleport.com" target="_blank" rel="noreferrer">
          Link as a button
        </a>
      </ButtonSecondary>
      <ButtonSecondary asChild disabled>
        <a href="https://goteleport.com" target="_blank" rel="noreferrer">
          Link as a button, disabled
        </a>
      </ButtonSecondary>
      <ButtonLink
        href="https://goteleport.com"
        target="_blank"
        rel="noreferrer"
      >
        Go to Teleport
      </ButtonLink>
    </ButtonGroup>
  );
}

Links.tags = ['!dev'];

export function Compact() {
  return <Button compact>Compact button</Button>;
}

Compact.parameters = {
  controls: {
    disable: true,
  },
};

export function Block() {
  return (
    <Box p={4}>
      <Button block>Block button</Button>
    </Box>
  );
}

Block.parameters = {
  layout: 'fullscreen',
  controls: {
    disable: true,
  },
};

export function Presets() {
  return (
    <ButtonGroup>
      <Button>Primary</Button>
      <ButtonSecondary>Secondary</ButtonSecondary>
      <ButtonBorder>Border</ButtonBorder>
      <ButtonWarning>Warning</ButtonWarning>
      <ButtonWarningBorder>Warning Border</ButtonWarningBorder>
      <ButtonText>Text</ButtonText>
    </ButtonGroup>
  );
}

Presets.parameters = {
  controls: {
    disable: true,
  },
};
