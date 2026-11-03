import { type PropsWithChildren } from 'react';

import { ThemeProvider } from '../src';

import { type StorybookTheme } from './themes';

interface StorybookThemeProviderProps {
  theme: StorybookTheme;
}

export function StorybookThemeProvider({
  children,
  theme,
}: PropsWithChildren<StorybookThemeProviderProps>) {
  return (
    <ThemeProvider system={theme.system} forcedTheme={theme.colorScheme}>
      {children}
    </ThemeProvider>
  );
}
