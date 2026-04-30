import { DatePicker as ArkDatePicker } from '@ark-ui/react/date-picker';
import {
  createSlotRecipeContext,
  Portal as ChakraPortal,
} from '@chakra-ui/react';

export { useDatePicker, useDatePickerContext } from '@ark-ui/react/date-picker';

const { withProvider, withContext } = createSlotRecipeContext({
  key: 'datePicker',
});

export const DatePickerRoot = withProvider<
  HTMLDivElement,
  ArkDatePicker.RootProps
>(ArkDatePicker.Root, 'root', { forwardAsChild: true });
export const DatePickerContent = withContext<
  HTMLDivElement,
  ArkDatePicker.ContentProps
>(ArkDatePicker.Content, 'content', { forwardAsChild: true });
export const DatePickerControl = withContext<
  HTMLDivElement,
  ArkDatePicker.ControlProps
>(ArkDatePicker.Control, 'control', { forwardAsChild: true });
export const DatePickerLabel = withContext<
  HTMLLabelElement,
  ArkDatePicker.LabelProps
>(ArkDatePicker.Label, 'label', { forwardAsChild: true });
export const DatePickerInput = withContext<
  HTMLInputElement,
  ArkDatePicker.InputProps
>(ArkDatePicker.Input, 'input', { forwardAsChild: true });
export const DatePickerTrigger = withContext<
  HTMLButtonElement,
  ArkDatePicker.TriggerProps
>(ArkDatePicker.Trigger, 'trigger', { forwardAsChild: true });
export const DatePickerClearTrigger = withContext<
  HTMLButtonElement,
  ArkDatePicker.ClearTriggerProps
>(ArkDatePicker.ClearTrigger, 'clearTrigger', { forwardAsChild: true });
export const DatePickerPositioner = withContext<
  HTMLDivElement,
  ArkDatePicker.PositionerProps
>(ArkDatePicker.Positioner, 'positioner', { forwardAsChild: true });
export const DatePickerView = withContext<
  HTMLDivElement,
  ArkDatePicker.ViewProps
>(ArkDatePicker.View, 'view', { forwardAsChild: true });
export const DatePickerViewControl = withContext<
  HTMLDivElement,
  ArkDatePicker.ViewControlProps
>(ArkDatePicker.ViewControl, 'viewControl', { forwardAsChild: true });
export const DatePickerViewTrigger = withContext<
  HTMLButtonElement,
  ArkDatePicker.ViewTriggerProps
>(ArkDatePicker.ViewTrigger, 'viewTrigger', { forwardAsChild: true });
export const DatePickerPrevTrigger = withContext<
  HTMLButtonElement,
  ArkDatePicker.PrevTriggerProps
>(ArkDatePicker.PrevTrigger, 'prevTrigger', { forwardAsChild: true });
export const DatePickerNextTrigger = withContext<
  HTMLButtonElement,
  ArkDatePicker.NextTriggerProps
>(ArkDatePicker.NextTrigger, 'nextTrigger', { forwardAsChild: true });
export const DatePickerRangeText = withContext<
  HTMLSpanElement,
  ArkDatePicker.RangeTextProps
>(ArkDatePicker.RangeText, 'rangeText', { forwardAsChild: true });
export const DatePickerTable = withContext<
  HTMLTableElement,
  ArkDatePicker.TableProps
>(ArkDatePicker.Table, 'table', { forwardAsChild: true });
export const DatePickerTableHead = withContext<
  HTMLTableSectionElement,
  ArkDatePicker.TableHeadProps
>(ArkDatePicker.TableHead, 'tableHead', { forwardAsChild: true });
export const DatePickerTableHeader = withContext<
  HTMLTableCellElement,
  ArkDatePicker.TableHeaderProps
>(ArkDatePicker.TableHeader, 'tableHeader', { forwardAsChild: true });
export const DatePickerTableBody = withContext<
  HTMLTableSectionElement,
  ArkDatePicker.TableBodyProps
>(ArkDatePicker.TableBody, 'tableBody', { forwardAsChild: true });
export const DatePickerTableRow = withContext<
  HTMLTableRowElement,
  ArkDatePicker.TableRowProps
>(ArkDatePicker.TableRow, 'tableRow', { forwardAsChild: true });
export const DatePickerTableCell = withContext<
  HTMLTableCellElement,
  ArkDatePicker.TableCellProps
>(ArkDatePicker.TableCell, 'tableCell', { forwardAsChild: true });
export const DatePickerTableCellTrigger = withContext<
  HTMLButtonElement,
  ArkDatePicker.TableCellTriggerProps
>(ArkDatePicker.TableCellTrigger, 'tableCellTrigger', { forwardAsChild: true });
export const DatePickerMonthSelect = withContext<
  HTMLSelectElement,
  ArkDatePicker.MonthSelectProps
>(ArkDatePicker.MonthSelect, 'monthSelect', { forwardAsChild: true });
export const DatePickerYearSelect = withContext<
  HTMLSelectElement,
  ArkDatePicker.YearSelectProps
>(ArkDatePicker.YearSelect, 'yearSelect', { forwardAsChild: true });
export const DatePickerPresetTrigger = withContext<
  HTMLButtonElement,
  ArkDatePicker.PresetTriggerProps
>(ArkDatePicker.PresetTrigger, 'presetTrigger', { forwardAsChild: true });

// `Context` and `Portal` aren't slots — they're auxiliary parts the
// namespace surfaces alongside the slot components.
export const DatePickerContext = ArkDatePicker.Context;
export const DatePickerPortal = ChakraPortal;
