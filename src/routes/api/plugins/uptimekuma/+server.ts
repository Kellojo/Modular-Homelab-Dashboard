import { json, error } from '@sveltejs/kit';
import getConfig from '../../../../lib/server/Config';
import { URL } from 'url';
import type { UptimeKumaHeartbeatResponse } from './types';
import { ValueState } from '../../../../lib/types/valueState';

export async function GET() {
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
}

function calculateUptime(heartBeat: UptimeKumaHeartbeatResponse): number {
	let uptimePercentage = 0;
	const uptimes = Object.keys(heartBeat.uptimeList);
	Object.keys(heartBeat.uptimeList).forEach((key: string) => {
		const uptime = heartBeat.uptimeList[key];
		uptimePercentage += uptime;
	});
	uptimePercentage /= uptimes.length;

	return uptimePercentage;
}

function getTimeSeries(heartBeat: UptimeKumaHeartbeatResponse): Array<TimeSeriesEntry> {
	//TimeSeriesCollection...

	return [];
}

interface TimeSeriesEntry {
	status: ValueState;
	time: string;
	text: string;
}
