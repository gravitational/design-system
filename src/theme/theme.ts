import {
  createSystem,
  defaultBaseConfig,
  defineConfig,
} from '@chakra-ui/react';

import { animationStyles } from './animationStyles';
import { breakpoints } from './breakpoints';
import { globalCss } from './globalCss';
import { keyframes } from './keyframes';
import { layerStyles } from './layerStyles';
import { recipes } from './recipes';
import { semanticTokens } from './semanticTokens';
import { slotRecipes } from './slotRecipes';
import { textStyles } from './textStyles';
import { tokens } from './tokens';

export const baseThemeConfig = defineConfig({
  preflight: true,
  cssVarsPrefix: 'teleport',
  cssVarsRoot: ':where(:root, :host)',
  globalCss,
  theme: {
    breakpoints,
    keyframes,
    tokens,
    semanticTokens,
    recipes,
    slotRecipes,
    textStyles,
    layerStyles,
    animationStyles,
  },
});

export const system = createSystem(defaultBaseConfig, baseThemeConfig);
