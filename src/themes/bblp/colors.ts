import { defineTokens } from '@chakra-ui/react';

import type { SingleColorThemeColors } from '../teleport/colors';

export const colors: SingleColorThemeColors = defineTokens.colors({
  levels: {
    deep: { value: '#000000' },
    sunken: { value: '#191919' },
    surface: { value: '#232323' },
    elevated: { value: '#282828' },
    popout: { value: '#373737' },
  },
  brand: {
    value: '#FFA028',
  },
  interactive: {
    solid: {
      primary: {
        default: { value: '#FFA028' },
        hover: { value: '#FFB04C' },
        active: { value: '#DB8922' },
      },
      success: {
        default: { value: '#00A223' },
        hover: { value: '#35D655' },
        active: { value: '#00851C' },
      },
      accent: {
        default: { value: '#66ABFF' },
        hover: { value: '#99C7FF' },
        active: { value: '#2B8EFF' },
      },
      danger: {
        default: { value: '#E51E3C' },
        hover: { value: '#FD2D4A' },
        active: { value: '#C31834' },
      },
      alert: {
        default: { value: '#FA5A28' },
        hover: { value: '#FB754C' },
        active: { value: '#D64D22' },
      },
    },
    tonal: {
      primary: {
        0: {
          value: 'rgba(255,160,40, 0.1)',
        },
        1: {
          value: 'rgba(255,160,40, 0.18)',
        },
        2: {
          value: 'rgba(255,160,40, 0.25)',
        },
      },
      success: {
        0: {
          value: 'rgba(0, 162, 35, 0.1)',
        },
        1: {
          value: 'rgba(0, 162, 35, 0.18)',
        },
        2: {
          value: 'rgba(0, 162, 35, 0.25)',
        },
      },
      danger: {
        0: {
          value: 'rgba(255, 98, 87, 0.1)',
        },
        1: {
          value: 'rgba(255, 98, 87, 0.18)',
        },
        2: {
          value: 'rgba(255, 98, 87, 0.25)',
        },
      },
      alert: {
        0: {
          value: 'rgba(255, 171, 0, 0.1)',
        },
        1: {
          value: 'rgba(255, 171, 0, 0.18)',
        },
        2: {
          value: 'rgba(255, 171, 0, 0.25)',
        },
      },
      informational: {
        0: {
          value: 'rgba(0, 158, 255, 0.1)',
        },
        1: {
          value: 'rgba(0, 158, 255, 0.18)',
        },
        2: {
          value: 'rgba(0, 158, 255, 0.25)',
        },
      },
      neutral: {
        0: {
          value: 'rgba(255,255,255,0.07)',
        },
        1: {
          value: 'rgba(255,255,255,0.13)',
        },
        2: {
          value: 'rgba(255,255,255,0.18)',
        },
      },
    },
  },
  text: {
    main: { value: '#FFFFFF' },
    slightlyMuted: { value: '#BEBEBE' },
    muted: { value: '#8C8C8C' },
    disabled: { value: '#646464' },
    primaryInverse: { value: '#000000' },
  },
  buttons: {
    text: { value: '#FFFFFF' },
    textDisabled: { value: 'rgba(255, 255, 255, 0.3)' },
    bgDisabled: { value: 'rgba(255, 255, 255, 0.12)' },

    primary: {
      text: { value: '#000000' },
      default: { value: '#FFA028' },
      hover: { value: '#FFB04C' },
      active: { value: '#DB8922' },
    },

    secondary: {
      default: { value: 'rgba(255,255,255,0.07)' },
      hover: { value: 'rgba(255,255,255,0.13)' },
      active: { value: 'rgba(255,255,255,0.18)' },
    },

    border: {
      default: { value: 'rgba(255,255,255,0)' },
      hover: { value: 'rgba(255, 255, 255, 0.07)' },
      active: { value: 'rgba(255, 255, 255, 0.13)' },
      border: { value: 'rgba(255, 255, 255, 0.36)' },
    },

    warning: {
      text: { value: '#FFFFFF' },
      default: { value: '#E51E3C' },
      hover: { value: '#FD2D4A' },
      active: { value: '#C31834' },
    },

    trashButton: {
      default: { value: 'rgba(255, 255, 255, 0.07)' },
      hover: { value: 'rgba(255, 255, 255, 0.13)' },
    },

    link: {
      default: { value: '#66ABFF' },
      hover: { value: '#99C7FF' },
      active: { value: '#2B8EFF' },
    },
  },
  tooltip: {
    background: {
      value: 'color-mix(in srgb, white 80%, {colors.levels.sunken})',
    },
    inverseBackground: {
      value: 'color-mix(in srgb, black 50%, {colors.levels.sunken})',
    },
  },
  progressBarColor: {
    value: '#00BFA5',
  },
  error: {
    main: { value: '#E51E3C' },
    hover: { value: '#FD2D4A' },
    active: { value: '#C31834' },
  },
  success: {
    main: { value: '#00A223' },
    hover: { value: '#35D655' },
    active: { value: '#00851C' },
  },
  warning: {
    main: { value: '#FA5A28' },
    hover: { value: '#FB754C' },
    active: { value: '#D64D22' },
  },
  accent: {
    main: { value: 'rgba(0, 158, 255, 1)' },
    hover: { value: 'rgba(51, 177, 255, 1)' },
    active: { value: 'rgba(102, 197, 255, 1)' },
  },
  notice: {
    background: {
      value: '{colors.levels.surface}',
    },
  },
  action: {
    active: { value: '#FFFFFF' },
    hover: { value: 'rgba(255, 255, 255, 0.1)' },
    selected: { value: 'rgba(255, 255, 255, 0.2)' },
    disabled: { value: 'rgba(255, 255, 255, 0.3)' },
    disabledBackground: { value: 'rgba(255, 255, 255, 0.12)' },
  },
  terminal: {
    foreground: {
      value: '#FFF',
    },
    background: {
      value: '{colors.levels.sunken}',
    },
    selectionBackground: {
      value: 'rgba(255, 255, 255, 0.18)',
    },
    cursor: {
      value: '#FFF',
    },
    cursorAccent: {
      value: '{colors.levels.sunken}',
    },
    red: {
      value: '{colors.dataVisualisation.primary.abbey}',
    },
    green: {
      value: '{colors.dataVisualisation.primary.caribbean}',
    },
    yellow: {
      value: '{colors.dataVisualisation.primary.sunflower}',
    },
    blue: {
      value: '{colors.dataVisualisation.primary.picton}',
    },
    magenta: {
      value: '{colors.dataVisualisation.primary.purple}',
    },
    cyan: {
      value: '{colors.dataVisualisation.primary.cyan}',
    },
    brightWhite: {
      value: 'color-mix(in srgb, white 89%, {colors.levels.sunken})',
    },
    white: {
      value: 'color-mix(in srgb, white 78%, {colors.levels.sunken})',
    },
    brightBlack: {
      value: 'color-mix(in srgb, white 61%, {colors.levels.sunken})',
    },
    black: {
      value: '#000',
    },
    brightRed: {
      value: '{colors.dataVisualisation.tertiary.abbey}',
    },
    brightGreen: {
      value: '{colors.dataVisualisation.tertiary.caribbean}',
    },
    brightYellow: {
      value: '{colors.dataVisualisation.tertiary.sunflower}',
    },
    brightBlue: {
      value: '{colors.dataVisualisation.tertiary.picton}',
    },
    brightMagenta: {
      value: '{colors.dataVisualisation.tertiary.purple}',
    },
    brightCyan: {
      value: '{colors.dataVisualisation.tertiary.cyan}',
    },
    searchMatch: {
      value: '#FFD98C',
    },
    activeSearchMatch: {
      value: '#FFAB00',
    },
  },
  dataVisualisation: {
    primary: {
      purple: { value: '#9F85FF' },
      wednesdays: { value: '#F74DFF' },
      picton: { value: '#009EFF' },
      sunflower: { value: '#FFAB00' },
      caribbean: { value: '#00BFA6' },
      abbey: { value: '#FF6257' },
      cyan: { value: '#00D3F0' },
    },
    secondary: {
      purple: { value: '#7D59FF' },
      wednesdays: { value: '#D50DE0' },
      picton: { value: '#007CC9' },
      sunflower: { value: '#AC7400' },
      caribbean: { value: '#008775' },
      abbey: { value: '#DB3F34' },
      cyan: { value: '#009CB1' },
    },
    tertiary: {
      purple: { value: '#B9A6FF' },
      wednesdays: { value: '#FA96FF' },
      picton: { value: '#7BCDFF' },
      sunflower: { value: '#FFD98C' },
      caribbean: { value: '#2EFFD5' },
      abbey: { value: '#FF948D' },
      cyan: { value: '#74EEFF' },
    },
  },
  editor: {
    abbey: {
      value: '{colors.dataVisualisation.tertiary.abbey}',
    },
    purple: {
      value: '{colors.dataVisualisation.tertiary.purple}',
    },
    cyan: {
      value: '{colors.dataVisualisation.tertiary.cyan}',
    },
    picton: {
      value: '{colors.dataVisualisation.tertiary.picton}',
    },
    sunflower: {
      value: '{colors.dataVisualisation.tertiary.sunflower}',
    },
    caribbean: {
      value: '{colors.dataVisualisation.tertiary.caribbean}',
    },
  },
  sessionRecording: {
    resource: {
      value: '#66C5FF',
    },
    user: {
      value: '#C5B6FF',
    },
  },
  sessionRecordingTimeline: {
    background: { value: '#1f2549' },
    headerBackground: { value: 'rgba(0, 0, 0, 0.13)' },
    frameBorder: { value: 'rgba(255, 255, 255, 0.2)' },
    progressLine: { value: '#E53E3E' },
    border: {
      default: { value: '#4c516e' },
      hover: { value: '#5f659e' },
    },
    cursor: { value: 'rgba(255, 255, 255, 0.4)' },
    events: {
      inactivity: {
        background: { value: 'rgba(159,133,255, 0.25)' },
        text: { value: 'rgba(255, 255, 255, 0.6)' },
      },
      resize: {
        semiBackground: { value: 'rgba(0, 0, 0, 0.8)' },
        background: { value: '#26323c' },
        border: { value: '#86c4ed' },
        text: { value: '#86c4ed' },
      },
      join: {
        background: { value: '#009EFF' },
        text: { value: 'rgba(0, 0, 0, 0.87)' },
      },
      default: {
        background: { value: 'rgba(255, 255, 255, 0.54)' },
        text: { value: '' },
      },
    },
    timeMarks: {
      primary: { value: '#718096' },
      secondary: { value: '#4A5568' },
      absolute: { value: '#E2E8F0' },
      text: { value: '#A0AEC0' },
    },
  },
  link: {
    value: '#66ABFF',
  },
  highlightedNavigationItem: {
    value: 'rgba(255, 255, 255, 0.3)',
  },
});
