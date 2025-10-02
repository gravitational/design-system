import {
  createSystem,
  defaultBaseConfig,
  type SystemConfig,
} from '@chakra-ui/react';

import { baseThemeConfig } from './theme';

export function createThemeSystem(...configs: SystemConfig[]) {
  return createSystem(defaultBaseConfig, baseThemeConfig, ...configs);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface TokenSchema<T = any> {
  value: T;
  description?: string | undefined;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type HasOnlyLightDark<T> = T extends { _light: any; _dark: any }
  ? keyof T extends '_light' | '_dark'
    ? true
    : false
  : false;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ExtractExtraKeys<T> = T extends { _light: any; _dark: any }
  ? Exclude<keyof T, '_light' | '_dark'>
  : never;

export type SingleColorTheme<T> = T extends TokenSchema
  ? HasOnlyLightDark<T['value']> extends true
    ? { value: number | string }
    : T['value'] extends object
      ? {
          value: { base: number | string } & Record<
            ExtractExtraKeys<T['value']>,
            number | string
          >;
        }
      : never
  : T extends object
    ? { [K in keyof T]: SingleColorTheme<T[K]> }
    : never;

export { tokensToCSSVariables } from './legacy';
