import cron from 'node-cron';
import { performance } from 'node:perf_hooks';
import getConfig from '$lib/server/Config';
import { getFullWidgetDataUrl } from '$lib/common/WidgetDataUrl';
import type { WidgetData } from '$lib/server/Config';
import { logError, logInfo, logSuccess } from '$lib/common/Logger';

// Prevent multiple schedules during HMR
if (!(globalThis as any).__documentMetricsCronStarted) {
	(globalThis as any).__documentMetricsCronStarted = true;

	initCron();
}

async function initCron() {
	const config = await getConfig();
	logInfo(
		`Scheduling document metrics refresh with expression: ${config.config.refreshCron}`,
		'CRON'
	);

	cron.schedule(config.config.refreshCron, () => documentMetrics(config));
	await documentMetrics(config);
}

async function documentMetrics(config: Awaited<ReturnType<typeof getConfig>>) {
	logInfo(`Refreshing document metrics`, 'CRON');
	performance.mark('start-refresh');

	const promises = config.widgets.map(refreshMetric);
	await Promise.all(promises);

	performance.mark('end-refresh');
	const measure = performance.measure('document-metrics-refresh', 'start-refresh', 'end-refresh');
	logInfo(`Finished refreshing all metrics in ${measure.duration.toFixed(0)}ms`, 'CRON');
}

async function refreshMetric(widget: WidgetData) {
	const dataPoint = widget.datapoint;
	if (!dataPoint) return;

	const startMark = `start-refresh-${dataPoint}`;
	const endMark = `end-refresh-${dataPoint}`;
	performance.mark(startMark);

	try {
		const dataUrl = getFullWidgetDataUrl(widget);
		const url = new URL(dataUrl);
		logInfo(`Refreshing widget ${dataPoint} at ${url}`, 'CRON');
		url.searchParams.set('addToHistory', 'true');
		await fetch(url);
	} catch (err) {
		logError(`Error refreshing widget ${dataPoint}: ${err}`, 'CRON');
	}

	performance.mark(endMark);
	const measure = performance.measure(`refresh-${dataPoint}`, startMark, endMark);
	logSuccess(`Refreshed widget ${dataPoint} in ${measure.duration.toFixed(0)}ms`, 'CRON');
}
