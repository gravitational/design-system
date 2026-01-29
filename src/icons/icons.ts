import * as icons from '@phosphor-icons/react';
import type { IconWeight } from '@phosphor-icons/react';

export interface IconConfig {
  icon: (typeof icons)[keyof typeof icons];
  weights?: IconWeight[];
}

export const AVAILABLE_ICONS: IconConfig[] = [
  // Automatically sorted when running pnpm generate-icons
  { icon: icons.ArrowBendDoubleUpRightIcon },
  { icon: icons.ArrowCircleUpIcon },
  { icon: icons.ArrowLineUpRightIcon },
  { icon: icons.ArrowUpIcon },
  { icon: icons.ArrowUpRightIcon },
  { icon: icons.AtIcon },
  { icon: icons.CaretDownIcon },
  { icon: icons.CaretLeftIcon },
  { icon: icons.CaretRightIcon },
  { icon: icons.CheckIcon, weights: ['regular', 'bold'] },
  { icon: icons.ChefHatIcon },
  { icon: icons.ClipboardIcon },
  { icon: icons.CodeIcon },
  { icon: icons.GithubLogoIcon },
  { icon: icons.HorseIcon },
  { icon: icons.StarIcon },
  { icon: icons.TrashIcon },
  { icon: icons.XIcon },
];
