import type { WidgetData } from '$lib/server/Config';

export function getWidgetDataUrl(
	datasource: string,
	datapoint: string,
	datafilter?: Record<string, string | number | boolean>
): string {
	let url = `/api/plugins/${datasource}/${datapoint.replaceAll('.', '/')}`;

	const hasAnyFilter = datafilter && Object.keys(datafilter).length > 0;
	if (hasAnyFilter) {
		url += url.includes('?') ? '&' : '?';
		const filterParams = Object.entries(datafilter!)
			.map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
			.join('&');
		url += filterParams;
	}

	return url;
}

export function getFullWidgetDataUrl(widget: WidgetData): string {
	if (widget.datasource === undefined || widget.datapoint === undefined) {
		throw new Error('Widget datasource or datapoint is undefined');
	}
	const path = getWidgetDataUrl(widget.datasource, widget.datapoint);

	const port = process.env.PORT || (process.env.NODE_ENV === 'development' ? 5173 : 3000);

	return `http://localhost:${port}${path}`;
}
