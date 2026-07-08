import { Portal, createSlotRecipeContext } from "@chakra-ui/react";
import { DatePicker, useDatePicker, useDatePickerContext } from "@ark-ui/react/date-picker";
//#region src/components/forms/datePicker/datePicker.ts
const { withProvider, withContext } = createSlotRecipeContext({ key: "datePicker" });
const DatePickerRoot = withProvider(DatePicker.Root, "root", { forwardAsChild: true });
const DatePickerContent = withContext(DatePicker.Content, "content", { forwardAsChild: true });
const DatePickerControl = withContext(DatePicker.Control, "control", { forwardAsChild: true });
const DatePickerLabel = withContext(DatePicker.Label, "label", { forwardAsChild: true });
const DatePickerInput = withContext(DatePicker.Input, "input", { forwardAsChild: true });
const DatePickerTrigger = withContext(DatePicker.Trigger, "trigger", { forwardAsChild: true });
const DatePickerClearTrigger = withContext(DatePicker.ClearTrigger, "clearTrigger", { forwardAsChild: true });
const DatePickerPositioner = withContext(DatePicker.Positioner, "positioner", { forwardAsChild: true });
const DatePickerView = withContext(DatePicker.View, "view", { forwardAsChild: true });
const DatePickerViewControl = withContext(DatePicker.ViewControl, "viewControl", { forwardAsChild: true });
const DatePickerViewTrigger = withContext(DatePicker.ViewTrigger, "viewTrigger", { forwardAsChild: true });
const DatePickerPrevTrigger = withContext(DatePicker.PrevTrigger, "prevTrigger", { forwardAsChild: true });
const DatePickerNextTrigger = withContext(DatePicker.NextTrigger, "nextTrigger", { forwardAsChild: true });
const DatePickerRangeText = withContext(DatePicker.RangeText, "rangeText", { forwardAsChild: true });
const DatePickerTable = withContext(DatePicker.Table, "table", { forwardAsChild: true });
const DatePickerTableHead = withContext(DatePicker.TableHead, "tableHead", { forwardAsChild: true });
const DatePickerTableHeader = withContext(DatePicker.TableHeader, "tableHeader", { forwardAsChild: true });
const DatePickerTableBody = withContext(DatePicker.TableBody, "tableBody", { forwardAsChild: true });
const DatePickerTableRow = withContext(DatePicker.TableRow, "tableRow", { forwardAsChild: true });
const DatePickerTableCell = withContext(DatePicker.TableCell, "tableCell", { forwardAsChild: true });
const DatePickerTableCellTrigger = withContext(DatePicker.TableCellTrigger, "tableCellTrigger", { forwardAsChild: true });
const DatePickerMonthSelect = withContext(DatePicker.MonthSelect, "monthSelect", { forwardAsChild: true });
const DatePickerYearSelect = withContext(DatePicker.YearSelect, "yearSelect", { forwardAsChild: true });
const DatePickerPresetTrigger = withContext(DatePicker.PresetTrigger, "presetTrigger", { forwardAsChild: true });
const DatePickerContext = DatePicker.Context;
const DatePickerPortal = Portal;
//#endregion
export { DatePickerClearTrigger, DatePickerContent, DatePickerContext, DatePickerControl, DatePickerInput, DatePickerLabel, DatePickerMonthSelect, DatePickerNextTrigger, DatePickerPortal, DatePickerPositioner, DatePickerPresetTrigger, DatePickerPrevTrigger, DatePickerRangeText, DatePickerRoot, DatePickerTable, DatePickerTableBody, DatePickerTableCell, DatePickerTableCellTrigger, DatePickerTableHead, DatePickerTableHeader, DatePickerTableRow, DatePickerTrigger, DatePickerView, DatePickerViewControl, DatePickerViewTrigger, DatePickerYearSelect, useDatePicker, useDatePickerContext };

//# sourceMappingURL=datePicker.js.map