import { defineTokens } from '@chakra-ui/react';

import { getPlatform, Platform } from '../../platform';

const fontMonoLinux = `"Droid Sans Mono", "monospace", monospace, "Droid Sans Fallback"`;
const fontMonoWin = `Consolas, "Courier New", monospace`;
const fontMonoMac = `Menlo, Monaco, "Courier New", monospace`;

function getMonoFont() {
  const platform = getPlatform();

  switch (platform) {
    case Platform.Linux:
      return fontMonoLinux;

    case Platform.macOS:
      return fontMonoMac;

    case Platform.Windows:
      return fontMonoWin;

    default:
      return fontMonoLinux;
  }
}

export const fonts = defineTokens.fonts({
  heading: {
    value:
      'Ubuntu2, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
  },
  body: {
    value:
      'Ubuntu2, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
  },
  mono: {
    value: getMonoFont(),
  },
});
