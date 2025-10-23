import { createWidgetEndpoint } from '$lib/server/StandardWidgetDataEndpoint';
import { json } from '@sveltejs/kit';
import { error } from 'console';
import getConfig from '$lib/server/Config';
import type { UptimeKumaHeartbeatResponse } from '../types';

export const GET = createWidgetEndpoint('uptimekuma/status', async () => {
	try {
		const config = await getConfig();
		const baseApiUrl = config.plugins.uptimekuma?.url;
		if (!baseApiUrl) return error(500, 'Uptime Kuma URL not configured');

		const statusPage = 'default';
		const heartBeatUrl = new URL(`/api/status-page/heartbeat/${statusPage}`, baseApiUrl).toString();

		const response = await fetch(heartBeatUrl);
		if (!response.ok) return error(500, 'Failed to fetch Uptime Kuma data');

		const heartBeat = (await response.json()) as UptimeKumaHeartbeatResponse;

		return json({
			uptimePercentage: calculateUptime(heartBeat),
			hearBeats: getTimeSeries(heartBeat)
		});
	} catch (e) {
		if (e instanceof Error) return error(500, e.message);
		return error(500, 'Unknown error');
	}
});
