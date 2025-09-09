import { ChakraProvider, type SystemContext } from '@chakra-ui/react';
import {
  ThemeProvider as NextThemeProvider,
  type ThemeProviderProps as NextThemeProviderProps,
} from 'next-themes';

interface ThemeProviderProps extends NextThemeProviderProps {
  system: SystemContext;
}

export function ThemeProvider({ system, ...rest }: ThemeProviderProps) {
  return (
    <ChakraProvider value={system}>
      <NextThemeProvider
        attribute="class"
        disableTransitionOnChange
        {...rest}
      />
    </ChakraProvider>
  );
}
