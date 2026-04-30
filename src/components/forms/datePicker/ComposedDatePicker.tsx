import { Flex } from '@chakra-ui/react';
import { useMemo } from 'react';
import type { RefAttributes } from 'react';

import { CaretLeftIcon, CaretRightIcon } from '../../../icons';

import { useDatePickerContext } from './datePicker';
import * as DatePicker from './namespace';

export type ComposedDatePickerProps = Omit<
  DatePicker.RootProps,
  'inline' | 'fixedWeeks'
>;

function ViewNavigation() {
  return (
    <DatePicker.ViewControl>
      <DatePicker.PrevTrigger>
        <CaretLeftIcon />
      </DatePicker.PrevTrigger>
      <DatePicker.ViewTrigger>
        <DatePicker.RangeText />
      </DatePicker.ViewTrigger>
      <DatePicker.NextTrigger>
        <CaretRightIcon />
      </DatePicker.NextTrigger>
    </DatePicker.ViewControl>
  );
}

function DayTable({ offset = 0 }: { offset?: number }) {
  const api = useDatePickerContext();
  const offsetData = useMemo(
    () => (offset ? api.getOffset({ months: offset }) : undefined),
    [api, offset]
  );
  const weeks = offsetData?.weeks ?? api.weeks;

  return (
    <DatePicker.Table>
      <DatePicker.TableHead>
        <DatePicker.TableRow>
          {api.weekDays.map((weekDay, i) => (
            <DatePicker.TableHeader key={i}>
              {weekDay.narrow}
            </DatePicker.TableHeader>
          ))}
        </DatePicker.TableRow>
      </DatePicker.TableHead>

      <DatePicker.TableBody>
        {weeks.map((week, i) => (
          <DatePicker.TableRow key={i}>
            {week.map((day, j) => (
              <DatePicker.TableCell
                key={j}
                value={day}
                visibleRange={offsetData?.visibleRange}
              >
                <DatePicker.TableCellTrigger>
                  {day.day}
                </DatePicker.TableCellTrigger>
              </DatePicker.TableCell>
            ))}
          </DatePicker.TableRow>
        ))}
      </DatePicker.TableBody>
    </DatePicker.Table>
  );
}

function GridTable({ view }: { view: 'month' | 'year' }) {
  const api = useDatePickerContext();
  const grid = useMemo(
    () =>
      view === 'month'
        ? api.getMonthsGrid({ columns: 4, format: 'short' })
        : api.getYearsGrid({ columns: 4 }),
    [api, view]
  );

  return (
    <DatePicker.Table>
      <DatePicker.TableBody>
        {grid.map((row, i) => (
          <DatePicker.TableRow key={i}>
            {row.map((cell, j) => (
              <DatePicker.TableCell key={j} value={cell.value}>
                <DatePicker.TableCellTrigger>
                  {cell.label}
                </DatePicker.TableCellTrigger>
              </DatePicker.TableCell>
            ))}
          </DatePicker.TableRow>
        ))}
      </DatePicker.TableBody>
    </DatePicker.Table>
  );
}

function CalendarViews({ numOfMonths = 1 }: { numOfMonths?: number }) {
  const offsets = useMemo(
    () => Array.from({ length: numOfMonths }, (_, i) => i),
    [numOfMonths]
  );

  return (
    <>
      <DatePicker.View view="day">
        <ViewNavigation />
        <Flex gap="4">
          {offsets.map(i => (
            <DayTable key={i} offset={i} />
          ))}
        </Flex>
      </DatePicker.View>

      <DatePicker.View view="month">
        <ViewNavigation />
        <GridTable view="month" />
      </DatePicker.View>

      <DatePicker.View view="year">
        <ViewNavigation />
        <GridTable view="year" />
      </DatePicker.View>
    </>
  );
}

/**
 * A calendar date picker for selecting date(s).
 */
export function ComposedDatePicker({
  children,
  ref,
  ...props
}: ComposedDatePickerProps & RefAttributes<HTMLDivElement>) {
  return (
    <DatePicker.Root ref={ref} {...props} inline fixedWeeks>
      {children ?? (
        <DatePicker.Content>
          <CalendarViews numOfMonths={props.numOfMonths} />
        </DatePicker.Content>
      )}
    </DatePicker.Root>
  );
}
