import { formatInteger } from '$lib/common/Formatter';
import type { AirtrailFlight } from './AirtrailClient';

export interface YearBreakdown {
	thisYear: number;
	overall: number;
}

export function aggregateForCurrentYear(flights: AirtrailFlight[]): YearBreakdown {
	const now = new Date();
	const year = now.getFullYear();
	let thisYear = 0;
	let overall = 0;

	for (const flight of flights) {
		overall++;
		const date = new Date(flight.date);
		if (date.getFullYear() === year) {
			thisYear++;
		}
	}

	return { thisYear, overall };
}

export function formatDuration(seconds: number): string {
	const totalMinutes = Math.round(seconds / 60);
	const days = Math.floor(totalMinutes / (60 * 24));
	const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
	const minutes = totalMinutes % 60;

	if (days > 0) {
		return `${days}d ${hours}h`;
	}
	if (hours > 0) {
		return `${hours}h ${minutes}m`;
	}
	return `${minutes}m`;
}

export function formatCombined(yearly: number, overall: number, unit: string): string {
	if (yearly === overall) {
		return `${formatInteger(overall)} ${unit}`;
	}
	return `${formatInteger(yearly)} ${unit} (${formatInteger(overall)} all time)`;
}

export function yearPlusAllTooltip(
	label: string,
	yearly: number,
	overall: number,
	formatter: (value: number) => string
): string {
	return `${label} this year: ${formatter(yearly)}\n${label} all time: ${formatter(overall)}`;
}