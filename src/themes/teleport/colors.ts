import { defineSemanticTokens } from '@chakra-ui/react';

import { tokensToCSSVariables, type SingleColorTheme } from '../../theme';

export const colors = defineSemanticTokens.colors({
  levels: {
    deep: {
      value: {
        _light: '#E6E9EA',
        _dark: '#000000',
      },
    },
    sunken: {
      value: {
        _light: '#F1F2F4',
        _dark: '#0C143D',
      },
    },
    surface: {
      value: {
        _light: '#FBFBFC',
        _dark: '#222C59',
      },
    },
    elevated: {
      value: {
        _light: '#FFFFFF',
        _dark: '#344179',
      },
    },
    popout: {
      value: {
        _light: '#FFFFFF',
        _dark: '#4A5688',
      },
    },
  },
  brand: {
    value: {
      _light: '#512FC9',
      _dark: '#9F85FF',
    },
  },
  interactive: {
    solid: {
      primary: {
        default: {
          value: {
            _light: '#512FC9',
            _dark: '#9F85FF',
          },
        },
        hover: {
          value: {
            _light: '#4126A1',
            _dark: '#B29DFF',
          },
        },
        active: {
          value: {
            _light: '#311C79',
            _dark: '#C5B6FF',
          },
        },
      },
      success: {
        default: {
          value: {
            _light: '#007D6B',
            _dark: '#00BFA6',
          },
        },
        hover: {
          value: {
            _light: '#006456',
            _dark: '#33CCB8',
          },
        },
        active: {
          value: {
            _light: '#004B40',
            _dark: '#66D9CA',
          },
        },
      },
      accent: {
        default: {
          value: {
            _light: '#0073BA',
            _dark: '#009EFF',
          },
        },
        hover: {
          value: {
            _light: '#005C95',
            _dark: '#33B1FF',
          },
        },
        active: {
          value: {
            _light: '#004570',
            _dark: '#66C5FF',
          },
        },
      },
      danger: {
        default: {
          value: {
            _light: '#CC372D',
            _dark: '#FF6257',
          },
        },
        hover: {
          value: {
            _light: '#A32C24',
            _dark: '#FF8179',
          },
        },
        active: {
          value: {
            _light: '#7A211B',
            _dark: '#FFA19A',
          },
        },
      },
      alert: {
        default: {
          value: {
            _light: '#FFAB00',
            _dark: '#FFAB00',
          },
        },
        hover: {
          value: {
            _light: '#CC8900',
            _dark: '#FFBC33',
          },
        },
        active: {
          value: {
            _light: '#996700',
            _dark: '#FFCD66',
          },
        },
      },
    },
    tonal: {
      primary: {
        0: {
          value: {
            _light: 'rgba(81,47,201, 0.1)',
            _dark: 'rgba(159,133,255, 0.1)',
          },
        },
        1: {
          value: {
            _light: 'rgba(81,47,201, 0.18)',
            _dark: 'rgba(159,133,255, 0.18)',
          },
        },
        2: {
          value: {
            _light: 'rgba(81,47,201, 0.25)',
            _dark: 'rgba(159,133,255, 0.25)',
          },
        },
      },
      success: {
        0: {
          value: {
            _light: 'rgba(0, 125, 107, 0.1)',
            _dark: 'rgba(0, 191, 166, 0.1)',
          },
        },
        1: {
          value: {
            _light: 'rgba(0, 125, 107, 0.18)',
            _dark: 'rgba(0, 191, 166, 0.18)',
          },
        },
        2: {
          value: {
            _light: 'rgba(0, 125, 107, 0.25)',
            _dark: 'rgba(0, 191, 166, 0.25)',
          },
        },
      },
      danger: {
        0: {
          value: {
            _light: 'rgba(204, 55, 45, 0.1)',
            _dark: 'rgba(255, 98, 87, 0.1)',
          },
        },
        1: {
          value: {
            _light: 'rgba(204, 55, 45, 0.18)',
            _dark: 'rgba(255, 98, 87, 0.18)',
          },
        },
        2: {
          value: {
            _light: 'rgba(204, 55, 45, 0.25)',
            _dark: 'rgba(255, 98, 87, 0.25)',
          },
        },
      },
      alert: {
        0: {
          value: {
            _light: 'rgba(255, 171, 0, 0.1)',
            _dark: 'rgba(255, 171, 0, 0.1)',
          },
        },
        1: {
          value: {
            _light: 'rgba(255, 171, 0, 0.18)',
            _dark: 'rgba(255, 171, 0, 0.18)',
          },
        },
        2: {
          value: {
            _light: 'rgba(255, 171, 0, 0.25)',
            _dark: 'rgba(255, 171, 0, 0.25)',
          },
        },
      },
      informational: {
        0: {
          value: {
            _light: 'rgba(0, 115, 186, 0.1)',
            _dark: 'rgba(0, 158, 255, 0.1)',
          },
        },
        1: {
          value: {
            _light: 'rgba(0, 115, 186, 0.18)',
            _dark: 'rgba(0, 158, 255, 0.18)',
          },
        },
        2: {
          value: {
            _light: 'rgba(0, 115, 186, 0.25)',
            _dark: 'rgba(0, 158, 255, 0.25)',
          },
        },
      },
      neutral: {
        0: {
          value: {
            _light: 'rgba(0,0,0,0.06)',
            _dark: 'rgba(255,255,255,0.07)',
          },
        },
        1: {
          value: {
            _light: 'rgba(0,0,0,0.13)',
            _dark: 'rgba(255,255,255,0.13)',
          },
        },
        2: {
          value: {
            _light: 'rgba(0,0,0,0.18)',
            _dark: 'rgba(255,255,255,0.18)',
          },
        },
      },
    },
  },
  text: {
    main: {
      value: {
        _light: '#000000',
        _dark: '#FFFFFF',
      },
    },
    slightlyMuted: {
      value: {
        _light: 'rgba(0,0,0,0.72)',
        _dark: 'rgba(255, 255, 255, 0.72)',
      },
    },
    muted: {
      value: {
        _light: 'rgba(0,0,0,0.54)',
        _dark: 'rgba(255, 255, 255, 0.54)',
      },
    },
    disabled: {
      value: {
        _light: 'rgba(0,0,0,0.36)',
        _dark: 'rgba(255, 255, 255, 0.36)',
      },
    },
    primaryInverse: {
      value: {
        _light: '#FFFFFF',
        _dark: '#000000',
      },
    },
  },
  buttons: {
    text: {
      value: {
        _light: '#000000',
        _dark: '#FFFFFF',
      },
    },
    textDisabled: {
      value: {
        _light: 'rgba(0,0,0,0.3)',
        _dark: 'rgba(255, 255, 255, 0.3)',
      },
    },
    bgDisabled: {
      value: {
        _light: 'rgba(0,0,0,0.12)',
        _dark: 'rgba(255, 255, 255, 0.12)',
      },
    },
    primary: {
      text: {
        value: {
          _light: '#FFFFFF',
          _dark: '#000000',
        },
      },
      default: {
        value: {
          _light: '#512FC9',
          _dark: '#9F85FF',
        },
      },
      hover: {
        value: {
          _light: '#4126A1',
          _dark: '#B29DFF',
        },
      },
      active: {
        value: {
          _light: '#311C79',
          _dark: '#C5B6FF',
        },
      },
    },
    secondary: {
      default: {
        value: {
          _light: 'rgba(0,0,0,0.07)',
          _dark: 'rgba(255,255,255,0.07)',
        },
      },
      hover: {
        value: {
          _light: 'rgba(0,0,0,0.13)',
          _dark: 'rgba(255,255,255,0.13)',
        },
      },
      active: {
        value: {
          _light: 'rgba(0,0,0,0.18)',
          _dark: 'rgba(255,255,255,0.18)',
        },
      },
    },
    border: {
      default: {
        value: {
          _light: 'rgba(255,255,255,0)',
          _dark: 'rgba(255,255,255,0)',
        },
      },
      hover: {
        value: {
          _light: 'rgba(0,0,0,0.07)',
          _dark: 'rgba(255, 255, 255, 0.07)',
        },
      },
      active: {
        value: {
          _light: 'rgba(0,0,0,0.13)',
          _dark: 'rgba(255, 255, 255, 0.13)',
        },
      },
      border: {
        value: {
          _light: 'rgba(0,0,0,0.36)',
          _dark: 'rgba(255, 255, 255, 0.36)',
        },
      },
    },
    warning: {
      text: {
        value: {
          _light: '#FFFFFF',
          _dark: '#000000',
        },
      },
      default: {
        value: {
          _light: '#CC372D',
          _dark: '#FF6257',
        },
      },
      hover: {
        value: {
          _light: '#A32C24',
          _dark: '#FF8179',
        },
      },
      active: {
        value: {
          _light: '#7A211B',
          _dark: '#FFA19A',
        },
      },
    },
    trashButton: {
      default: {
        value: {
          _light: 'rgba(0,0,0,0.07)',
          _dark: 'rgba(255, 255, 255, 0.07)',
        },
      },
      hover: {
        value: {
          _light: 'rgba(0,0,0,0.13)',
          _dark: 'rgba(255, 255, 255, 0.13)',
        },
      },
    },
    link: {
      default: {
        value: {
          _light: '#0073BA',
          _dark: '#009EFF',
        },
      },
      hover: {
        value: {
          _light: '#005C95',
          _dark: '#33B1FF',
        },
      },
      active: {
        value: {
          _light: '#004570',
          _dark: '#66C5FF',
        },
      },
    },
  },
  tooltip: {
    background: {
      value: {
        _light: 'color-mix(in srgb, black 80%, {colors.levels.sunken})',
        _dark: 'color-mix(in srgb, white 80%, {colors.levels.sunken})',
      },
    },
    inverseBackground: {
      value: {
        _light: 'color-mix(in srgb, white 50%, {colors.levels.sunken})',
        _dark: 'color-mix(in srgb, black 50%, {colors.levels.sunken})',
      },
    },
  },
  progressBarColor: {
    value: {
      _light: '#007D6B',
      _dark: '#00BFA5',
    },
  },
  error: {
    main: {
      value: {
        _light: '#CC372D',
        _dark: '#FF6257',
      },
    },
    hover: {
      value: {
        _light: '#A32C24',
        _dark: '#FF8179',
      },
    },
    active: {
      value: {
        _light: '#7A211B',
        _dark: '#FFA19A',
      },
    },
  },
  success: {
    main: {
      value: {
        _light: '#007D6B',
        _dark: '#00BFA6',
      },
    },
    hover: {
      value: {
        _light: '#006456',
        _dark: '#33CCB8',
      },
    },
    active: {
      value: {
        _light: '#004B40',
        _dark: '#66D9CA',
      },
    },
  },
  warning: {
    main: {
      value: {
        _light: '#FFAB00',
        _dark: '#FFAB00',
      },
    },
    hover: {
      value: {
        _light: '#CC8900',
        _dark: '#FFBC33',
      },
    },
    active: {
      value: {
        _light: '#996700',
        _dark: '#FFCD66',
      },
    },
  },
  accent: {
    main: {
      value: {
        _light: 'rgba(0, 115, 186, 1)',
        _dark: 'rgba(0, 158, 255, 1)',
      },
    },
    hover: {
      value: {
        _light: 'rgba(0, 92, 149, 1)',
        _dark: 'rgba(51, 177, 255, 1)',
      },
    },
    active: {
      value: {
        _light: 'rgba(0, 69, 112, 1)',
        _dark: 'rgba(102, 197, 255, 1)',
      },
    },
  },
  notice: {
    background: {
      value: {
        _light: '{colors.blue.50}',
        _dark: '{colors.levels.elevated}',
      },
    },
  },
  action: {
    active: {
      value: {
        _light: '#FFFFFF',
        _dark: '#FFFFFF',
      },
    },
    hover: {
      value: {
        _light: 'rgba(255, 255, 255, 0.1)',
        _dark: 'rgba(255, 255, 255, 0.1)',
      },
    },
    selected: {
      value: {
        _light: 'rgba(255, 255, 255, 0.2)',
        _dark: 'rgba(255, 255, 255, 0.2)',
      },
    },
    disabled: {
      value: {
        _light: 'rgba(255, 255, 255, 0.3)',
        _dark: 'rgba(255, 255, 255, 0.3)',
      },
    },
    disabledBackground: {
      value: {
        _light: 'rgba(255, 255, 255, 0.12)',
        _dark: 'rgba(255, 255, 255, 0.12)',
      },
    },
  },
  terminal: {
    foreground: {
      value: {
        _light: '#000',
        _dark: '#FFF',
      },
    },
    background: {
      value: {
        _light: '{colors.levels.sunken}',
        _dark: '{colors.levels.sunken}',
      },
    },
    selectionBackground: {
      value: {
        _light: 'rgba(0, 0, 0, 0.18)',
        _dark: 'rgba(255, 255, 255, 0.18)',
      },
    },
    cursor: {
      value: {
        _light: '#000',
        _dark: '#FFF',
      },
    },
    cursorAccent: {
      value: {
        _light: '{colors.levels.sunken}',
        _dark: '{colors.levels.sunken}',
      },
    },
    red: {
      value: {
        _light: '{colors.dataVisualisation.tertiary.abbey}',
        _dark: '{colors.dataVisualisation.primary.abbey}',
      },
    },
    green: {
      value: {
        _light: '{colors.dataVisualisation.tertiary.caribbean}',
        _dark: '{colors.dataVisualisation.primary.caribbean}',
      },
    },
    yellow: {
      value: {
        _light: '{colors.dataVisualisation.tertiary.yellow}',
        _dark: '{colors.dataVisualisation.primary.sunflower}',
      },
    },
    blue: {
      value: {
        _light: '{colors.dataVisualisation.tertiary.picton}',
        _dark: '{colors.dataVisualisation.primary.picton}',
      },
    },
    magenta: {
      value: {
        _light: '{colors.dataVisualisation.tertiary.purple}',
        _dark: '{colors.dataVisualisation.primary.purple}',
      },
    },
    cyan: {
      value: {
        _light: '{colors.dataVisualisation.tertiary.cyan}',
        _dark: '{colors.dataVisualisation.primary.cyan}',
      },
    },
    brightWhite: {
      value: {
        _light: 'color-mix(in srgb, black 89%, {colors.levels.sunken})',
        _dark: 'color-mix(in srgb, white 89%, {colors.levels.sunken})',
      },
    },
    white: {
      value: {
        _light: 'color-mix(in srgb, black 78%, {colors.levels.sunken})',
        _dark: 'color-mix(in srgb, white 78%, {colors.levels.sunken})',
      },
    },
    brightBlack: {
      value: {
        _light: 'color-mix(in srgb, black 61%, {colors.levels.sunken})',
        _dark: 'color-mix(in srgb, white 61%, {colors.levels.sunken})',
      },
    },
    black: {
      value: {
        _light: '#000',
        _dark: '#000',
      },
    },
    brightRed: {
      value: {
        _light: '{colors.dataVisualisation.primary.abbey}',
        _dark: '{colors.dataVisualisation.tertiary.abbey}',
      },
    },
    brightGreen: {
      value: {
        _light: '{colors.dataVisualisation.primary.caribbean}',
        _dark: '{colors.dataVisualisation.tertiary.caribbean}',
      },
    },
    brightYellow: {
      value: {
        _light: '{colors.dataVisualisation.primary.sunflower}',
        _dark: '{colors.dataVisualisation.tertiary.sunflower}',
      },
    },
    brightBlue: {
      value: {
        _light: '{colors.dataVisualisation.primary.picton}',
        _dark: '{colors.dataVisualisation.tertiary.picton}',
      },
    },
    brightMagenta: {
      value: {
        _light: '{colors.dataVisualisation.primary.purple}',
        _dark: '{colors.dataVisualisation.tertiary.purple}',
      },
    },
    brightCyan: {
      value: {
        _light: '{colors.dataVisualisation.primary.cyan}',
        _dark: '{colors.dataVisualisation.tertiary.cyan}',
      },
    },
    searchMatch: {
      value: {
        _light: '#FFD98C',
        _dark: '#FFD98C',
      },
    },
    activeSearchMatch: {
      value: {
        _light: '#FFAB00',
        _dark: '#FFAB00',
      },
    },
  },
  dataVisualisation: {
    primary: {
      purple: {
        value: {
          _light: '#5531D4',
          _dark: '#9F85FF',
        },
      },
      wednesdays: {
        value: {
          _light: '#A70DAF',
          _dark: '#F74DFF',
        },
      },
      picton: {
        value: {
          _light: '#006BB8',
          _dark: '#009EFF',
        },
      },
      sunflower: {
        value: {
          _light: '#8F5F00',
          _dark: '#FFAB00',
        },
      },
      caribbean: {
        value: {
          _light: '#007562',
          _dark: '#00BFA6',
        },
      },
      abbey: {
        value: {
          _light: '#BF372E',
          _dark: '#FF6257',
        },
      },
      cyan: {
        value: {
          _light: '#007282',
          _dark: '#00D3F0',
        },
      },
    },
    secondary: {
      purple: {
        value: {
          _light: '#6F4CED',
          _dark: '#7D59FF',
        },
      },
      wednesdays: {
        value: {
          _light: '#DC37E5',
          _dark: '#D50DE0',
        },
      },
      picton: {
        value: {
          _light: '#0089DE',
          _dark: '#007CC9',
        },
      },
      sunflower: {
        value: {
          _light: '#B27800',
          _dark: '#AC7400',
        },
      },
      caribbean: {
        value: {
          _light: '#009681',
          _dark: '#008775',
        },
      },
      abbey: {
        value: {
          _light: '#D4635B',
          _dark: '#DB3F34',
        },
      },
      cyan: {
        value: {
          _light: '#1792A3',
          _dark: '#009CB1',
        },
      },
    },
    tertiary: {
      purple: {
        value: {
          _light: '#3D1BB2',
          _dark: '#B9A6FF',
        },
      },
      wednesdays: {
        value: {
          _light: '#690274',
          _dark: '#FA96FF',
        },
      },
      picton: {
        value: {
          _light: '#004B89',
          _dark: '#7BCDFF',
        },
      },
      sunflower: {
        value: {
          _light: '#704B00',
          _dark: '#FFD98C',
        },
      },
      caribbean: {
        value: {
          _light: '#005742',
          _dark: '#2EFFD5',
        },
      },
      abbey: {
        value: {
          _light: '#9D0A00',
          _dark: '#FF948D',
        },
      },
      cyan: {
        value: {
          _light: '#015C6E',
          _dark: '#74EEFF',
        },
      },
    },
  },
  editor: {
    abbey: {
      value: {
        _light: '{colors.dataVisualisation.primary.abbey}',
        _dark: '{colors.dataVisualisation.tertiary.abbey}',
      },
    },
    purple: {
      value: {
        _light: '{colors.dataVisualisation.primary.purple}',
        _dark: '{colors.dataVisualisation.tertiary.purple}',
      },
    },
    cyan: {
      value: {
        _light: '{colors.dataVisualisation.primary.cyan}',
        _dark: '{colors.dataVisualisation.tertiary.cyan}',
      },
    },
    picton: {
      value: {
        _light: '{colors.dataVisualisation.primary.picton}',
        _dark: '{colors.dataVisualisation.tertiary.picton}',
      },
    },
    sunflower: {
      value: {
        _light: '{colors.dataVisualisation.primary.sunflower}',
        _dark: '{colors.dataVisualisation.tertiary.sunflower}',
      },
    },
    caribbean: {
      value: {
        _light: '{colors.dataVisualisation.primary.caribbean}',
        _dark: '{colors.dataVisualisation.tertiary.caribbean}',
      },
    },
  },
  sessionRecording: {
    resource: {
      value: {
        _light: '#004570',
        _dark: '#66C5FF',
      },
    },
    user: {
      value: {
        _light: '#311C79',
        _dark: '#C5B6FF',
      },
    },
  },
  sessionRecordingTimeline: {
    background: {
      value: {
        _light: '#FBFBFC',
        _dark: '#1f2549',
      },
    },
    headerBackground: {
      value: {
        _light: 'rgba(0, 0, 0, 0.05)',
        _dark: 'rgba(0, 0, 0, 0.13)',
      },
    },
    frameBorder: {
      value: {
        _light: 'rgba(0, 0, 0, 0.2)',
        _dark: 'rgba(255, 255, 255, 0.2)',
      },
    },
    progressLine: {
      value: {
        _light: '#E53E3E',
        _dark: '#E53E3E',
      },
    },
    border: {
      default: {
        value: {
          _light: '#4c516e',
          _dark: '#4c516e',
        },
      },
      hover: {
        value: {
          _light: '#5f659e',
          _dark: '#5f659e',
        },
      },
    },
    cursor: {
      value: {
        _light: 'rgba(0, 0, 0, 0.4)',
        _dark: 'rgba(255, 255, 255, 0.4)',
      },
    },
    events: {
      inactivity: {
        background: {
          value: {
            _light: 'rgba(81,47,201, 0.25)',
            _dark: 'rgba(159,133,255, 0.25)',
          },
        },
        text: {
          value: {
            _light: 'rgba(0, 0, 0, 0.6)',
            _dark: 'rgba(255, 255, 255, 0.6)',
          },
        },
      },
      resize: {
        semiBackground: {
          value: {
            _light: 'rgba(0, 0, 0, 0.8)',
            _dark: 'rgba(0, 0, 0, 0.8)',
          },
        },
        background: {
          value: {
            _light: '#86c4ed',
            _dark: '#26323c',
          },
        },
        border: {
          value: {
            _light: '#26323c',
            _dark: '#86c4ed',
          },
        },
        text: {
          value: {
            _light: '#26323c',
            _dark: '#86c4ed',
          },
        },
      },
      join: {
        background: {
          value: {
            _light: '#0073BA',
            _dark: '#009EFF',
          },
        },
        text: {
          value: {
            _light: 'rgba(255, 255, 255, 0.8)',
            _dark: 'rgba(0, 0, 0, 0.87)',
          },
        },
      },
      default: {
        background: {
          value: {
            _light: 'rgba(0, 0, 0, 0.54)',
            _dark: 'rgba(255, 255, 255, 0.54)',
          },
        },
        text: {
          value: {
            _light: '#000',
            _dark: '#fff',
          },
        },
      },
    },
    timeMarks: {
      primary: {
        value: {
          _light: 'rgba(0,0,0,0.54)',
          _dark: '#718096',
        },
      },
      secondary: {
        value: {
          _light: 'rgba(0,0,0,0.36)',
          _dark: '#4A5568',
        },
      },
      absolute: {
        value: {
          _light: 'rgba(0,0,0,0.87)',
          _dark: '#E2E8F0',
        },
      },
      text: {
        value: {
          _light: 'rgba(0,0,0,0.87)',
          _dark: '#A0AEC0',
        },
      },
    },
  },
  link: {
    value: {
      _light: '#0073BA',
      _dark: '#009EFF',
    },
  },
  highlightedNavigationItem: {
    value: {
      _light: '{colors.blue.200}',
      _dark: 'rgba(255, 255, 255, 0.3)',
    },
  },
});

// Convert the theme tokens to CSS variables so we can derive the legacy theme from the new Teleport
// theme. This is a temporary solution until we migrate all components to use the new theme.
export const LEGACY_THEME_COLORS = tokensToCSSVariables(colors);
export type LegacyThemeColors = typeof LEGACY_THEME_COLORS;

// Use the Teleport theme as the source of truth for the color types. Other themes will use
// this type to ensure they implement all the required color tokens.
export type ThemeColors = typeof colors;
export type SingleColorThemeColors = SingleColorTheme<ThemeColors>;
