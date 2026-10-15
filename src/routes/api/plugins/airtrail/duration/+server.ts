import { createWidgetEndpoint } from '$lib/server/StandardWidgetDataEndpoint';
import type { FillDataWidgetValue } from '$lib/types/DataWidgetValueTypes';
import { ValueState } from '$lib/types/valueState';
import AirtrailClient from '../AirtrailClient';
import { formatCombinedDuration, formatDuration, yearPlusAllTooltip } from '../helpers';

export const GET = createWidgetEndpoint(
	'airtrail/duration',
	async (): Promise<FillDataWidgetValue> => {
		const client = new AirtrailClient();
		const flights = await client.getAllFlights();

		const now = new Date();
		const year = now.getFullYear();
		let thisYearSeconds = 0;
		let overallSeconds = 0;

		for (const flight of flights) {
			const duration = flight.duration ?? 0;
			overallSeconds += duration;

			const date = new Date(flight.date);
			if (date.getFullYear() === year) {
				thisYearSeconds += duration;
			}
		}

		return {
			value: thisYearSeconds,
			classification: overallSeconds > 0 ? ValueState.Success : ValueState.Unknown,
			unit: 'duration',
			displayValue: formatCombinedDuration(thisYearSeconds, overallSeconds),
			url: (await client.getAirtrailUrl()) || '',
			tooltip: yearPlusAllTooltip('Time in the air', thisYearSeconds, overallSeconds, (v) =>
				formatDuration(v)
			)
		};
	}
);