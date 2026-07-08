import { type SystemContext } from '@chakra-ui/react';
import { type ThemeProviderProps as NextThemeProviderProps } from 'next-themes';
interface ThemeProviderProps extends NextThemeProviderProps {
    system: SystemContext;
}
export declare function ThemeProvider({ system, ...rest }: ThemeProviderProps): import("react/jsx-runtime").JSX.Element;
export {};
