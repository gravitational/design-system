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

export type SingleColorTheme<T> = T extends TokenSchema
  ? { value: number | string }
  : T extends object
    ? { [K in keyof T]: SingleColorTheme<T[K]> }
    : never;

export { tokensToCSSVariables } from './legacy';
