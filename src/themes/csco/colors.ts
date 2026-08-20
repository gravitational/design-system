import { defineSemanticTokens } from '@chakra-ui/react';

const paired = (light: string, dark: string) => ({
  value: {
    _light: light,
    _dark: dark,
  },
});

const states = (
  light: [string, string, string],
  dark: [string, string, string]
) => ({
  default: paired(light[0], dark[0]),
  hover: paired(light[1], dark[1]),
  active: paired(light[2], dark[2]),
});

const tonal = (
  light: [string, string, string],
  dark: [string, string, string]
) => ({
  0: paired(light[0], dark[0]),
  1: paired(light[1], dark[1]),
  2: paired(light[2], dark[2]),
});

const dataVisualisation = (
  light: [string, string, string, string, string, string, string],
  dark: [string, string, string, string, string, string, string]
) => ({
  purple: paired(light[0], dark[0]),
  wednesdays: paired(light[1], dark[1]),
  picton: paired(light[2], dark[2]),
  sunflower: paired(light[3], dark[3]),
  caribbean: paired(light[4], dark[4]),
  abbey: paired(light[5], dark[5]),
  cyan: paired(light[6], dark[6]),
});

export const colors = defineSemanticTokens.colors({
  levels: {
    deep: paired('#E1E4E8', '#000000'),
    sunken: paired('#F0F1F2', '#0F1214'),
    surface: paired('#F7F7F7', '#23282E'),
    elevated: paired('#FFFFFF', '#373C42'),
    popout: paired('#FFFFFF', '#464C54'),
  },
  brand: paired('#1D69CC', '#649EF5'),
  interactive: {
    solid: {
      primary: states(
        ['#1D69CC', '#1754A3', '#113F7A'],
        ['#649EF5', '#83B1F7', '#A2C5F9']
      ),
      success: states(
        ['#139BEB', '#0F7CBC', '#0B5D8D'],
        ['#33BBF5', '#5CC9F7', '#85D6F9']
      ),
      accent: states(
        ['#1D69CC', '#1754A3', '#113F7A'],
        ['#649EF5', '#83B1F7', '#A2C5F9']
      ),
      danger: states(
        ['#CC2D37', '#A3242C', '#7A1B21'],
        ['#FA5762', '#FB7981', '#FC9AA1']
      ),
      alert: states(
        ['#CC8604', '#A36B03', '#7A5002'],
        ['#F0C243', '#F3CE69', '#F6DA8E']
      ),
    },
    tonal: {
      primary: tonal(
        [
          'rgba(29, 105, 204, 0.1)',
          'rgba(29, 105, 204, 0.18)',
          'rgba(29, 105, 204, 0.25)',
        ],
        [
          'rgba(100, 158, 245, 0.1)',
          'rgba(100, 158, 245, 0.18)',
          'rgba(100, 158, 245, 0.25)',
        ]
      ),
      success: tonal(
        [
          'rgba(19, 155, 235, 0.1)',
          'rgba(19, 155, 235, 0.18)',
          'rgba(19, 155, 235, 0.25)',
        ],
        [
          'rgba(51, 187, 245, 0.1)',
          'rgba(51, 187, 245, 0.18)',
          'rgba(51, 187, 245, 0.25)',
        ]
      ),
      danger: tonal(
        [
          'rgba(204, 45, 55, 0.1)',
          'rgba(204, 45, 55, 0.18)',
          'rgba(204, 45, 55, 0.25)',
        ],
        [
          'rgba(250, 87, 98, 0.1)',
          'rgba(250, 87, 98, 0.18)',
          'rgba(250, 87, 98, 0.25)',
        ]
      ),
      alert: tonal(
        [
          'rgba(204, 134, 4, 0.1)',
          'rgba(204, 134, 4, 0.18)',
          'rgba(204, 134, 4, 0.25)',
        ],
        [
          'rgba(240, 194, 67, 0.1)',
          'rgba(240, 194, 67, 0.18)',
          'rgba(240, 194, 67, 0.25)',
        ]
      ),
      informational: tonal(
        [
          'rgba(29, 105, 204, 0.1)',
          'rgba(29, 105, 204, 0.18)',
          'rgba(29, 105, 204, 0.25)',
        ],
        [
          'rgba(100, 158, 245, 0.1)',
          'rgba(100, 158, 245, 0.18)',
          'rgba(100, 158, 245, 0.25)',
        ]
      ),
      neutral: tonal(
        [
          'rgba(101, 108, 117, 0.06)',
          'rgba(101, 108, 117, 0.13)',
          'rgba(101, 108, 117, 0.18)',
        ],
        [
          'rgba(167, 173, 181, 0.07)',
          'rgba(167, 173, 181, 0.13)',
          'rgba(167, 173, 181, 0.18)',
        ]
      ),
    },
  },
  text: {
    main: paired('#23282E', '#F7F7F7'),
    slightlyMuted: paired('#596069', '#D0D4D9'),
    muted: paired('#596069', '#9BA4AE'),
    disabled: paired('#A7ADB5', '#6F7680'),
    primaryInverse: paired('#FFFFFF', '#23282E'),
  },
  buttons: {
    text: paired('#23282E', '#F7F7F7'),
    textDisabled: paired('#C1C6CC', '#6F7680'),
    bgDisabled: paired('#F0F1F2', '#464C54'),
    primary: {
      text: paired('#FFFFFF', '#23282E'),
      ...states(
        ['#1D69CC', '#1754A3', '#113F7A'],
        ['#649EF5', '#83B1F7', '#A2C5F9']
      ),
    },
    secondary: states(
      [
        'rgba(101, 108, 117, 0.06)',
        'rgba(101, 108, 117, 0.13)',
        'rgba(101, 108, 117, 0.18)',
      ],
      [
        'rgba(167, 173, 181, 0.07)',
        'rgba(167, 173, 181, 0.13)',
        'rgba(167, 173, 181, 0.18)',
      ]
    ),
    border: {
      default: paired('rgba(255,255,255,0)', 'rgba(255,255,255,0)'),
      hover: paired('rgba(0,0,0,0.07)', 'rgba(167, 173, 181, 0.07)'),
      active: paired('rgba(0,0,0,0.13)', 'rgba(167, 173, 181, 0.13)'),
      border: paired('rgba(0,0,0,0.36)', 'rgba(255, 255, 255, 0.36)'),
    },
    warning: {
      text: paired('#FFFFFF', '#23282E'),
      ...states(
        ['#CC2D37', '#A3242C', '#7A1B21'],
        ['#FA5762', '#FB7981', '#FC9AA1']
      ),
    },
    trashButton: {
      default: paired('rgba(101, 108, 117, 0.06)', 'rgba(167, 173, 181, 0.07)'),
      hover: paired('rgba(101, 108, 117, 0.13)', 'rgba(167, 173, 181, 0.13)'),
    },
    link: states(
      ['#1D69CC', '#1754A3', '#113F7A'],
      ['#649EF5', '#83B1F7', '#A2C5F9']
    ),
  },
  tooltip: {
    background: paired('rgba(0, 0, 0, 0.8)', 'rgba(255, 255, 255, 0.8)'),
    inverseBackground: paired('rgba(255, 255, 255, 0.5)', 'rgba(0, 0, 0, 0.5)'),
    inverseLinkDefault: paired('#1D69CC', '#649EF5'),
  },
  progressBarColor: paired('#139BEB', '#52A62B'),
  error: {
    main: paired('#CC2D37', '#FA5762'),
    hover: paired('#B2242D', '#FB7981'),
    active: paired('#7A1B21', '#FC9AA1'),
  },
  success: {
    main: paired('#139BEB', '#33BBF5'),
    hover: paired('#0F7CBC', '#5CC9F7'),
    active: paired('#0B5D8D', '#85D6F9'),
  },
  warning: {
    main: paired('#CC8604', '#F0C243'),
    hover: paired('#A36B03', '#F3CE69'),
    active: paired('#7A5002', '#F6DA8E'),
  },
  accent: {
    main: paired('#1D69CC', '#649EF5'),
    hover: paired('#1754A3', '#83B1F7'),
    active: paired('#113F7A', '#A2C5F9'),
  },
  notice: {
    background: paired('#F7F7F7', '#4A576D'),
  },
  action: {
    active: paired('#23282E', '#F7F7F7'),
    hover: paired('rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.1)'),
    selected: paired('rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.2)'),
    disabled: paired('#C1C6CC', '#6F7680'),
    disabledBackground: paired('#F0F1F2', '#464C54'),
  },
  terminal: {
    foreground: paired('#23282E', '#F7F7F7'),
    background: paired('{colors.levels.sunken}', '{colors.levels.sunken}'),
    selectionBackground: paired(
      'rgba(82, 166, 43, 0.25)',
      'rgba(100, 158, 245, 0.25)'
    ),
    cursor: paired('#23282E', '#F7F7F7'),
    cursorAccent: paired('{colors.levels.sunken}', '{colors.levels.sunken}'),
    brightWhite: paired(
      '#889099',
      'color-mix(in srgb, white 89%, {colors.levels.sunken})'
    ),
    white: paired(
      '#6F7680',
      'color-mix(in srgb, white 78%, {colors.levels.sunken})'
    ),
    brightBlack: paired(
      '#596069',
      'color-mix(in srgb, white 61%, {colors.levels.sunken})'
    ),
    black: paired('#23282E', '#000000'),
    searchMatch: paired('#D5E8F5', '#195385'),
    activeSearchMatch: paired('#139BEB', '#33BBF5'),
  },
  dataVisualisation: {
    primary: dataVisualisation(
      [
        '#753BCC',
        '#A73D90',
        '#535ED2',
        '#AD3907',
        '#37794B',
        '#B02863',
        '#006773',
      ],
      [
        '#B587FA',
        '#F26DD1',
        '#8A95FF',
        '#F7782F',
        '#36B26E',
        '#F57398',
        '#17C2C2',
      ]
    ),
    secondary: dataVisualisation(
      [
        '#7E4DD8',
        '#D649B3',
        '#6977F0',
        '#AF4A21',
        '#169855',
        '#B33D6E',
        '#54939A',
      ],
      [
        '#8D4EED',
        '#A55B96',
        '#6971AC',
        '#C44F14',
        '#38835C',
        '#CF3A7A',
        '#0BB2B8',
      ]
    ),
    tertiary: dataVisualisation(
      [
        '#6732B8',
        '#A62686',
        '#4653C7',
        '#942E03',
        '#087041',
        '#991D53',
        '#005C66',
      ],
      [
        '#C299FF',
        '#F582D8',
        '#9CA6FF',
        '#FC8D4C',
        '#4CBF7F',
        '#FF87A9',
        '#4AD9D9',
      ]
    ),
  },
  sessionRecording: {
    player: {
      progressBar: {
        progress: paired('#139BEB', '#33BBF5'),
      },
    },
    resource: paired('#1D69CC', '#649EF5'),
    user: paired('#139BEB', '#33BBF5'),
    riskLevels: {
      low: paired('#087041', '#4CBF7F'),
      medium: paired('#942E03', '#FC8D4C'),
      high: paired('#6732B8', '#C299FF'),
      critical: paired('#991D53', '#FF87A9'),
    },
  },
  sessionRecordingTimeline: {
    background: paired('#E1E4E8', '#0F1214'),
    headerBackground: paired('rgba(0, 0, 0, 0.05)', 'rgba(0, 0, 0, 0.13)'),
    frameBorder: paired('rgba(0, 0, 0, 0.2)', 'rgba(255, 255, 255, 0.2)'),
    progressLine: paired('#B02863', '#F57398'),
    border: {
      default: paired('#90A0AB', '#3A4A5A'),
      hover: paired('#535ED2', '#5A7A9A'),
    },
    cursor: paired('rgba(0, 0, 0, 0.4)', 'rgba(255, 255, 255, 0.4)'),
    events: {
      inactivity: {
        background: paired(
          'rgba(19, 155, 235, 0.25)',
          'rgba(100, 158, 245, 0.25)'
        ),
        text: paired('rgba(0, 0, 0, 0.6)', 'rgba(255, 255, 255, 0.6)'),
      },
      resize: {
        semiBackground: paired('rgba(0, 0, 0, 0.8)', 'rgba(0, 0, 0, 0.8)'),
        background: paired('#86C4ED', '#26323C'),
        border: paired('#23282E', '#D0D4D9'),
        text: paired('#23282E', '#D0D4D9'),
      },
      join: {
        background: paired('#2774D9', '#4D7BBF'),
        text: paired('rgba(255, 255, 255, 0.87)', 'rgba(0, 0, 0, 0.87)'),
      },
      default: {
        background: paired('rgba(0, 0, 0, 0.54)', 'rgba(255, 255, 255, 0.54)'),
        text: paired('#000000', '#FFFFFF'),
      },
    },
    timeMarks: {
      primary: paired('rgba(0,0,0,0.54)', 'rgba(255,255,255,0.54)'),
      secondary: paired('rgba(0,0,0,0.36)', 'rgba(255,255,255,0.36)'),
      absolute: paired('rgba(0,0,0,0.87)', 'rgba(255,255,255,0.87)'),
      text: paired('rgba(0,0,0,0.87)', 'rgba(255,255,255,0.87)'),
    },
  },
  link: paired('#1D69CC', '#649EF5'),
  highlightedNavigationItem: paired(
    'rgba(19, 155, 235, 0.2)',
    'rgba(100, 158, 245, 0.2)'
  ),
});
