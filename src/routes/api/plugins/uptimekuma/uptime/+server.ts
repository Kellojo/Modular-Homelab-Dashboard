import { createWidgetEndpoint } from '$lib/server/StandardWidgetDataEndpoint';
import getConfig from '$lib/server/Config';
import type { UptimeKumaHeartbeatResponse } from '../types';
import { getValueStateHIB } from '$lib/types/valueState';

export const GET = createWidgetEndpoint('uptimekuma/status', async () => {
	const config = await getConfig();
	const baseApiUrl = config.plugins.uptimekuma?.url;
	if (!baseApiUrl) throw new Error('Uptime Kuma URL not configured');

	const statusPage = config.plugins.uptimekuma?.statusPage || 'default';
	const heartBeatUrl = new URL(`/api/status-page/heartbeat/${statusPage}`, baseApiUrl).toString();

	const response = await fetch(heartBeatUrl);
	if (!response.ok) throw new Error('Failed to fetch Uptime Kuma data');

	const heartBeat = (await response.json()) as UptimeKumaHeartbeatResponse;
	const uptime = calculateUptime(heartBeat);

	return {
		value: uptime,
		classification: getValueStateHIB(uptime, { warning: 97, error: 75 }),
		displayValue: `${uptime.toFixed(1)}%`,
		unit: '%',
		min: 0,
		max: 100
	};
});

function calculateUptime(heartBeat: UptimeKumaHeartbeatResponse): number {
	let uptimePercentage = 0;
	const uptimes = Object.keys(heartBeat.uptimeList);
	Object.keys(heartBeat.uptimeList).forEach((key: string) => {
		const uptime = heartBeat.uptimeList[key];
		uptimePercentage += uptime;
	});
	uptimePercentage /= uptimes.length;

	return uptimePercentage * 100;
}
