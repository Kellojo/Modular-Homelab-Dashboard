export function getDateDaysAgo(days: number): Date {
	const date = new Date();
	date.setDate(date.getDate() - days);
	date.setHours(0, 0, 0, 0);
	return date;
}

export function areOnSameDay(date1: Date | string, date2: Date | string): boolean {
	const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
	const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
	return (
		d1.getFullYear() === d2.getFullYear() &&
		d1.getMonth() === d2.getMonth() &&
		d1.getDate() === d2.getDate()
	);
}
