import { chakra } from '@chakra-ui/react';
import type { Header } from '@tanstack/react-table';
import type { ComponentProps, ReactNode } from 'react';

import { CaretDownIcon, CaretUpDownIcon, CaretUpIcon } from '../../icons';
import { Label } from '../label';

export interface LabelDescription {
  name: string;
  value: string;
}

export function TextCell({
  data,
}: {
  data: string | number | null | undefined;
}) {
  return <>{data ?? ''}</>;
}

export function LabelCell({ data = [] }: { data: string[] }) {
  return (
    <chakra.div display="flex" flexWrap="wrap" gap={1}>
      {data.map((label, index) => (
        <Label key={`${label}${index}`} kind="secondary">
          {label}
        </Label>
      ))}
    </chakra.div>
  );
}

export function ClickableLabelCell({
  labels,
  onClick,
}: {
  labels: LabelDescription[];
  onClick: (label: LabelDescription) => void;
}) {
  return (
    <chakra.div display="flex" flexWrap="wrap" gap={1}>
      {labels.map((label, index) => (
        <chakra.button
          key={`${label.name}${label.value}${index}`}
          type="button"
          bg="transparent"
          border="none"
          p={0}
          cursor="pointer"
          onClick={e => {
            e.stopPropagation();
            onClick(label);
          }}
        >
          <Label
            kind="secondary"
            _hover={{ bg: 'interactive.tonal.neutral.1' }}
          >
            {`${label.name}: ${label.value}`}
          </Label>
        </chakra.button>
      ))}
    </chakra.div>
  );
}

export interface SortableHeaderProps<TData, TValue> {
  header: Header<TData, TValue>;
  children: ReactNode;
}

/**
 * Renders a column header with a sort indicator.
 */
export function SortableHeader<TData, TValue>({
  header,
  children,
}: SortableHeaderProps<TData, TValue>) {
  const canSort = header.column.getCanSort();
  const sorted = header.column.getIsSorted();

  if (!canSort) return <>{children}</>;

  return (
    <chakra.button
      type="button"
      onClick={header.column.getToggleSortingHandler()}
      display="flex"
      alignItems="center"
      gap={1}
      bg="transparent"
      border="none"
      color="inherit"
      cursor="pointer"
      font="inherit"
      p={0}
    >
      {children}
      <SortIndicator sorted={sorted} aria-hidden />
    </chakra.button>
  );
}

function SortIndicator({
  sorted,
  ...rest
}: { sorted: false | 'asc' | 'desc' } & ComponentProps<typeof CaretUpIcon>) {
  if (sorted === 'desc') return <CaretDownIcon {...rest} />;
  if (sorted === 'asc') return <CaretUpIcon {...rest} />;
  return <CaretUpDownIcon {...rest} />;
}
