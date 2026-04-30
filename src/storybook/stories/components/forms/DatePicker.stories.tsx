import { Box } from '@chakra-ui/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { ComposedDatePicker, DatePicker } from '../../../../components';
import { CaretLeftIcon, CaretRightIcon } from '../../../../icons';

const hiddenTags = ['!dev'];

const meta = {
  title: 'Components/Forms/Date Picker',
  component: ComposedDatePicker,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof ComposedDatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export function SingleExample() {
  return <ComposedDatePicker />;
}
SingleExample.tags = hiddenTags;

export const Single: Story = {
  name: 'Single',
  parameters: { controls: { disable: true } },
  render: SingleExample,
};

export function RangeExample() {
  return <ComposedDatePicker selectionMode="range" />;
}
RangeExample.tags = hiddenTags;

export const Range: Story = {
  name: 'Range',
  parameters: { controls: { disable: true } },
  render: RangeExample,
};

export function MultiMonthExample() {
  return <ComposedDatePicker selectionMode="range" numOfMonths={2} />;
}
MultiMonthExample.tags = hiddenTags;

export const MultiMonth: Story = {
  name: 'Multiple Months',
  parameters: { controls: { disable: true } },
  render: MultiMonthExample,
};

export function ComposeExample() {
  return (
    <DatePicker.Root inline fixedWeeks>
      <DatePicker.Content>
        <DatePicker.View view="day">
          <DatePicker.Context>
            {api => (
              <>
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
                <DatePicker.Table>
                  <DatePicker.TableHead>
                    <DatePicker.TableRow>
                      {api.weekDays.map((w, i) => (
                        <DatePicker.TableHeader key={i}>
                          {w.narrow}
                        </DatePicker.TableHeader>
                      ))}
                    </DatePicker.TableRow>
                  </DatePicker.TableHead>
                  <DatePicker.TableBody>
                    {api.weeks.map((week, i) => (
                      <DatePicker.TableRow key={i}>
                        {week.map((day, j) => (
                          <DatePicker.TableCell key={j} value={day}>
                            <DatePicker.TableCellTrigger>
                              {day.day}
                            </DatePicker.TableCellTrigger>
                          </DatePicker.TableCell>
                        ))}
                      </DatePicker.TableRow>
                    ))}
                  </DatePicker.TableBody>
                </DatePicker.Table>
                <Box mt={2} textStyle="sm" color="text.muted">
                  Selected: {api.valueAsString[0] ?? 'None'}
                </Box>
              </>
            )}
          </DatePicker.Context>
        </DatePicker.View>
      </DatePicker.Content>
    </DatePicker.Root>
  );
}
ComposeExample.tags = hiddenTags;

export const Compose: Story = {
  name: 'Compose mode',
  parameters: { controls: { disable: true } },
  render: ComposeExample,
};
