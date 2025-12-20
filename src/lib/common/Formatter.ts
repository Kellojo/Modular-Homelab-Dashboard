import { filesize } from 'filesize';
import moment from 'moment';

export function formatInteger(value: number): string {
	// Handle small numbers and zero
	if (Math.abs(value) < 1000) return value.toString();

	const units = ['K', 'M', 'B', 'T'];
	let unitIndex = -1;
	let absValue = Math.abs(value);

	while (absValue >= 1000 && unitIndex < units.length - 1) {
		absValue /= 1000;
		unitIndex++;
	}

	// Round to one decimal place if needed, otherwise no decimals
	const rounded = absValue >= 10 ? Math.round(absValue) : Math.round(absValue * 10) / 10;
	const sign = value < 0 ? '-' : '';

	return `${sign}${rounded}${units[unitIndex]}`;
}

export function formatFloat(value: number, decimals: number = 2): string {
	return value.toFixed(decimals);
}

export function formatTimeAgo(date: Date | string): string {
	const m = moment(date);
	m.fromNow();

	return `${m.fromNow()} ago`;
}

export function formatTime(date: Date | string): string {
	const m = moment(date);
	return m.format('HH:mm');
}

export function formatFileSize(bytes: number, round: number = 2): string {
	return filesize(bytes, { round });
}
