import { ChakraProvider } from '@chakra-ui/react';
import { ThemeProvider as NextThemeProvider } from 'next-themes';
import { type PropsWithChildren } from 'react';

import { type StorybookTheme } from './themes';

interface StorybookThemeProviderProps {
  theme: StorybookTheme;
}

export function StorybookThemeProvider({
  children,
  theme,
}: PropsWithChildren<StorybookThemeProviderProps>) {
  return (
    <ChakraProvider value={theme.system}>
      <NextThemeProvider
        attribute="class"
        disableTransitionOnChange
        forcedTheme={theme.colorScheme}
      >
        {children}
      </NextThemeProvider>
    </ChakraProvider>
  );
}
