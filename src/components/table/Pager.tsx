import { chakra } from '@chakra-ui/react';

import { ArrowCircleLeftIcon, ArrowCircleRightIcon } from '../../icons';

export interface PagerProps {
  onPrev?: () => void;
  onNext?: () => void;
  isLoading?: boolean;
  /** Index of the first row on the current page. */
  from?: number;
  /** Index of the last row on the current page. */
  to?: number;
  /** Total count of rows. */
  totalCount?: number;
}

export function Pager({
  onPrev,
  onNext,
  isLoading,
  from,
  to,
  totalCount,
}: PagerProps) {
  const showRange =
    totalCount != null && totalCount > 0 && from != null && to != null;

  return (
    <chakra.div
      display="flex"
      justifyContent="flex-end"
      width="100%"
      alignItems="center"
      mb={1}
    >
      {showRange && (
        <chakra.span
          textStyle="body3"
          marginInlineEnd={2}
          whiteSpace="nowrap"
          color="text.main"
        >
          Showing <chakra.strong fontWeight="bold">{from}</chakra.strong> -{' '}
          <chakra.strong fontWeight="bold">{to}</chakra.strong> of{' '}
          <chakra.strong fontWeight="bold">{totalCount}</chakra.strong>
        </chakra.span>
      )}
      <chakra.div display="flex">
        <ArrowButton
          onClick={onPrev}
          title="Previous page"
          disabled={!onPrev || isLoading}
          type="button"
        >
          <ArrowCircleLeftIcon />
        </ArrowButton>
        <ArrowButton
          onClick={onNext}
          title="Next page"
          disabled={!onNext || isLoading}
          type="button"
        >
          <ArrowCircleRightIcon />
        </ArrowButton>
      </chakra.div>
    </chakra.div>
  );
}

const ArrowButton = chakra('button', {
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    bg: 'transparent',
    border: 'none',
    color: 'text.slightlyMuted',
    cursor: 'pointer',
    p: 1,
    borderRadius: 'sm',
    transitionProperty: 'common',
    transitionDuration: 'moderate',
    '& svg': {
      fontSize: 7,
    },
    _hover: {
      color: 'text.main',
      bg: 'interactive.tonal.neutral.0',
    },
    _disabled: {
      color: 'text.disabled',
      cursor: 'not-allowed',
      _hover: {
        bg: 'transparent',
      },
    },
  },
});
