// src/lib/server/cron.ts
import cron from 'node-cron';
import { performance } from 'node:perf_hooks';
import getConfig from '$lib/server/Config';
import { getFullWidgetDataUrl } from '$lib/common/WidgetDataUrl';
import type { WidgetData } from '$lib/server/Config';

// Prevent multiple schedules during HMR
if (!(globalThis as any).__documentMetricsCronStarted) {
	(globalThis as any).__documentMetricsCronStarted = true;

	initCron();
}

async function initCron() {
	const config = await getConfig();
	console.log(
		`[CRON] Scheduling document metrics refresh with expression: ${config.config.refreshCron}`
	);

	cron.schedule(config.config.refreshCron, () => documentMetrics(config));
	await documentMetrics(config);
}

async function documentMetrics(config: Awaited<ReturnType<typeof getConfig>>) {
	console.log(`[CRON] Refreshing document metrics`);
	performance.mark('start-refresh');

	const promises = config.widgets.map(refreshMetric);
	await Promise.all(promises);

	performance.mark('end-refresh');
	const measure = performance.measure('document-metrics-refresh', 'start-refresh', 'end-refresh');
	console.log(`[CRON] Finished refreshing all metrics in ${measure.duration.toFixed(0)}ms\n`);
}

async function refreshMetric(widget: WidgetData) {
	const dataPoint = widget.datapoint;
	if (!dataPoint) return;

	const startMark = `start-refresh-${dataPoint}`;
	const endMark = `end-refresh-${dataPoint}`;
	performance.mark(startMark);

	try {
		const path = getFullWidgetDataUrl(widget);
		await fetch(path + '?addToHistory=true');
	} catch (err) {
		console.error(`[CRON] Error refreshing widget ${dataPoint}:`, err);
	}

	performance.mark(endMark);
	const measure = performance.measure(`refresh-${dataPoint}`, startMark, endMark);
	console.log(`[CRON] Refreshed widget ${dataPoint} in ${measure.duration.toFixed(0)}ms`);
}
