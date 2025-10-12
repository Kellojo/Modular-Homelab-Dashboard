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

export interface DataWidgetResponse<T> {
	current: T;
	history: DataWidgetResponseHistoryPoint<T>[];
}

export interface DataWidgetResponseHistoryPoint<T> {
	timestamp: Date;
	value: T;
}
