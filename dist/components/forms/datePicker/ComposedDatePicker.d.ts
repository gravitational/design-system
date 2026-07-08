import type { RefAttributes } from 'react';
import * as DatePicker from './namespace';
export type ComposedDatePickerProps = Omit<DatePicker.RootProps, 'inline' | 'fixedWeeks'>;
/**
 * A calendar date picker for selecting date(s).
 */
export declare function ComposedDatePicker({ children, ref, ...props }: ComposedDatePickerProps & RefAttributes<HTMLDivElement>): import("react/jsx-runtime").JSX.Element;
