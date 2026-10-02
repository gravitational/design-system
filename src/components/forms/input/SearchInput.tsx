import { MagnifyingGlassIcon } from '../../../icons';
import { Input, type InputProps } from './Input';
import type { RefAttributes } from 'react';

export function SearchInput(
  props: InputProps & RefAttributes<HTMLInputElement>
) {
  return (
    <Input type="search" shape="pill" icon={MagnifyingGlassIcon} {...props} />
  );
}
