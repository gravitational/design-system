import { ChakraProvider, type SystemContext } from '@chakra-ui/react';
import { type PropsWithChildren, useLayoutEffect } from 'react';

import { type ColorMode } from '../theme';

interface ThemeProviderProps extends PropsWithChildren {
  /** The Chakra design system. */
  system: SystemContext;
  /** The resolved color mode. */
  forcedTheme?: ColorMode;
}

export function ThemeProvider({
  system,
  forcedTheme,
  children,
}: ThemeProviderProps) {
  useLayoutEffect(() => {
    const root = document.documentElement;

    // Disable transitions during the theme change, otherwise elements with
    // a color-related transition (buttons, inputs, etc.) visibly animate to
    // their new colors instead of flipping instantly.
    // This matches disableTransitionOnChange behavior in next-themes.
    const style = document.createElement('style');
    style.textContent = '*,*::before,*::after{transition:none!important}';
    document.head.appendChild(style);

    root.classList.remove('light', 'dark');
    if (forcedTheme) {
      root.classList.add(forcedTheme);
      root.style.colorScheme = forcedTheme;
    } else {
      root.style.colorScheme = '';
    }

    // Force a style recalculation before restoring transitions.
    void window.getComputedStyle(document.body).opacity;

    const id = setTimeout(() => {
      style.remove();
    }, 1);

    return () => {
      clearTimeout(id);
      style.remove();
      root.classList.remove('light', 'dark');
      root.style.colorScheme = '';
    };
  }, [forcedTheme]);

  return <ChakraProvider value={system}>{children}</ChakraProvider>;
}
