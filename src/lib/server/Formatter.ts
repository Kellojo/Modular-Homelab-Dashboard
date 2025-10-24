import { HumanizeDuration, HumanizeDurationLanguage } from 'humanize-duration-ts';

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

export function formatDuration(seconds: number): string {
	const langService: HumanizeDurationLanguage = new HumanizeDurationLanguage();
	const humanizer: HumanizeDuration = new HumanizeDuration(langService);

	return humanizer.humanize(seconds * 1000);
}

export function formatDateDuration(start: Date, end: Date): string {
	const seconds = Math.floor((end.getTime() - start.getTime()) / 1000);
	return formatDuration(seconds);
}

export function formatTimeAgo(date: Date): string {
	return `${formatDateDuration(date, new Date())} ago`;
}
