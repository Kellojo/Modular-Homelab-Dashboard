import type { ValueState } from './valueState';

export interface TextDataWidgetValue {
	displayValue: string;
	classification: ValueState;
	url?: string;
}

export interface FillDataWidgetValue {
	displayValue: string;
	value: number | string;
	classification: ValueState;
	tooltip: string;
	url?: string;
	unit: string;
	min?: number;
	max?: number;
}

export interface ListDataWidgetValue {
    displayValue: string;
    items: FillDataWidgetValue[];
}

export interface DataWidgetResponse<T> {
	current: T;
	history: DataWidgetResponseHistoryPoint<T>[];
}

export interface DataWidgetResponseHistoryPoint<T> {
	timestamp: Date;
	value: T;
}
