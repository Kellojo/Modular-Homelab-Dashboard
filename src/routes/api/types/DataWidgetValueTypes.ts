import type { ValueState } from './valueState';

export interface TextDataWidgetValue {
	displayValue: string;
	classification: ValueState;
}

export interface FillDataWidgetValue {
	displayValue: string;
	value: number | string;
	classification: ValueState;
	unit: string;
	min?: number;
	max?: number;
}
