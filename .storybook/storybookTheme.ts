import {
  defineConfig,
  defineGlobalStyles,
  defineSemanticTokens,
} from '@chakra-ui/react';
import { create, ensure } from 'storybook/theming';

export const storybookTheme = ensure(
  create({
    base: 'dark',
    brandTitle: 'Teleport Design System',
    brandUrl: 'https://design.teleport.dev',
  })
);

const globalStorybookCss = defineGlobalStyles({
  html: {
    textStyle: 'body2',
  },
  body: {
    margin: 0,
    backgroundColor: 'levels.sunken',
    color: 'text.main',
    padding: 0,
  },
  'input, textarea, button': {
    fontFamily: '{fonts.body}',
  },
  input: {
    accentColor: 'brand',
    '&::placeholder': {
      color: 'text.muted',
    },
  },
  'div.sb-preparing-docs.sb-wrapper, div.sb-preparing-story': {
    backgroundColor: '{colors.levels.sunken} !important',
  },
  'div.sb-previewBlock': {
    backgroundColor: '{colors.levels.elevated} !important',
  },
  '.sb-argstableBlock th span, .sb-argstableBlock td span': {
    backgroundColor: '{colors.interactive.tonal.neutral.1} !important',
  },
  '.sb-argstableBlock-body td': {
    background: '{colors.levels.elevated} !important',
  },
  '.sb-argstableBlock-body tr:not(:first-of-type)': {
    borderTopColor: '{colors.interactive.tonal.neutral.2} !important',
  },
  '.sb-loader': {
    color: '{colors.text.main} !important',
  },
});

const colors = defineSemanticTokens.colors({
  semanticTokensExample: {
    bg: {
      DEFAULT: {
        value: {
          _light: '{colors.grey.100}',
          _dark: '{colors.grey.800}',
          _active: '{colors.semanticTokensExample.bg.active}',
          _focus: '{colors.semanticTokensExample.bg.main}',
        },
      },
      main: {
        value: {
          _light: '{colors.red.100}',
          _dark: '{colors.red.800}',
        },
      },
      active: {
        value: {
          _light: '{colors.blue.200}',
          _dark: '{colors.blue.700}',
        },
      },
    },
  },
  syntax: {
    background: {
      value: {
        _light: '#FAFAFA',
        _dark: '#282828',
      },
    },
    comment: {
      value: {
        _light: '#6A737D',
        _dark: '#6272A4',
      },
    },
    foreground: {
      value: {
        _light: '#24292E',
        _dark: '#F8F8F2',
      },
    },
    selection: {
      value: {
        _light: '#E1E4E8',
        _dark: '#44475A',
      },
    },
    cyan: {
      value: {
        _light: '#0598BC',
        _dark: '#8BE9FD',
      },
    },
    green: {
      value: {
        _light: '#22863A',
        _dark: '#50FA7B',
      },
    },
    orange: {
      value: {
        _light: '#E36209',
        _dark: '#FFB86C',
      },
    },
    pink: {
      value: {
        _light: '#EA4A5A',
        _dark: '#FF79C6',
      },
    },
    purple: {
      value: {
        _light: '#6F42C1',
        _dark: '#BD93F9',
      },
    },
    red: {
      value: {
        _light: '#D73A49',
        _dark: '#FF5555',
      },
    },
    yellow: {
      value: {
        _light: '#B08800',
        _dark: '#F1FA8C',
      },
    },
    background30: {
      value: {
        _light: '#FAFAFA33',
        _dark: '#282A3633',
      },
    },
    comment30: {
      value: {
        _light: '#6A737D33',
        _dark: '#6272A433',
      },
    },
    foreground30: {
      value: {
        _light: '#24292E33',
        _dark: '#F8F8F233',
      },
    },
    selection30: {
      value: {
        _light: '#E1E4E833',
        _dark: '#44475A33',
      },
    },
    cyan30: {
      value: {
        _light: '#0598BC33',
        _dark: '#8BE9FD33',
      },
    },
    green30: {
      value: {
        _light: '#22863A33',
        _dark: '#50FA7B33',
      },
    },
    orange30: {
      value: {
        _light: '#E3620933',
        _dark: '#FFB86C33',
      },
    },
    pink30: {
      value: {
        _light: '#EA4A5A33',
        _dark: '#FF79C633',
      },
    },
    purple30: {
      value: {
        _light: '#6F42C133',
        _dark: '#BD93F933',
      },
    },
    red30: {
      value: {
        _light: '#D73A4933',
        _dark: '#FF555533',
      },
    },
    yellow30: {
      value: {
        _light: '#B0880033',
        _dark: '#F1FA8C33',
      },
    },
    background40: {
      value: {
        _light: '#FAFAFA66',
        _dark: '#282A3666',
      },
    },
    comment40: {
      value: {
        _light: '#6A737D66',
        _dark: '#6272A466',
      },
    },
    foreground40: {
      value: {
        _light: '#24292E66',
        _dark: '#F8F8F266',
      },
    },
    selection40: {
      value: {
        _light: '#E1E4E866',
        _dark: '#44475A66',
      },
    },
    cyan40: {
      value: {
        _light: '#0598BC66',
        _dark: '#8BE9FD66',
      },
    },
    green40: {
      value: {
        _light: '#22863A66',
        _dark: '#50FA7B66',
      },
    },
    orange40: {
      value: {
        _light: '#E3620966',
        _dark: '#FFB86C66',
      },
    },
    pink40: {
      value: {
        _light: '#EA4A5A66',
        _dark: '#FF79C666',
      },
    },
    purple40: {
      value: {
        _light: '#6F42C166',
        _dark: '#BD93F966',
      },
    },
    red40: {
      value: {
        _light: '#D73A4966',
        _dark: '#FF555566',
      },
    },
    yellow40: {
      value: {
        _light: '#B0880066',
        _dark: '#F1FA8C66',
      },
    },
  },
});

export const storybookConfig = defineConfig({
  globalCss: globalStorybookCss,
  theme: {
    semanticTokens: {
      colors,
    },
  },
});
