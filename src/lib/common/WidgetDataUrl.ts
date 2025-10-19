import type { WidgetData } from '$lib/server/Config';

export function getWidgetDataUrl(datasource: string, datapoint: string): string {
	return `/api/plugins/${datasource}/${datapoint.replaceAll('.', '/')}`;
}

export function getFullWidgetDataUrl(widget: WidgetData): string {
	if (widget.datasource === undefined || widget.datapoint === undefined) {
		throw new Error('Widget datasource or datapoint is undefined');
	}
	const path = getWidgetDataUrl(widget.datasource, widget.datapoint);

	const port = process.env.PORT || (process.env.NODE_ENV === 'development' ? 5173 : 3000);

	return `http://localhost:${port}${path}`;
}
