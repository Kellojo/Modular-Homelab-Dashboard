import { formatInteger } from '$lib/common/Formatter';
import { createWidgetEndpoint } from '$lib/server/StandardWidgetDataEndpoint';
import type { FillDataWidgetValue } from '$lib/types/DataWidgetValueTypes';
import { ValueState } from '$lib/types/valueState';
import AirtrailClient from '../AirtrailClient';
import { aggregateForCurrentYear, estimateDistanceForYear, formatCombined, yearPlusAllTooltip } from '../helpers';

export const GET = createWidgetEndpoint(
	'airtrail/distance',
	async (): Promise<FillDataWidgetValue> => {
		const client = new AirtrailClient();
		const stats = await client.getStats();
		const overall = stats.distanceKm;

		const flights = await client.getAllFlights();
		const { thisYear, overall: overallFlights } = aggregateForCurrentYear(flights);

		if (stats.flights === 0 || overall === 0) {
			return {
				value: 0,
				classification: ValueState.Unknown,
				unit: 'km',
				displayValue: '0 km',
				url: (await client.getAirtrailUrl()) || '',
				tooltip: 'Distance: 0 km all time'
			};
		}

		const thisYearDistance = estimateDistanceForYear(thisYear, overallFlights, overall);

		return {
			value: thisYearDistance,
			classification: ValueState.Success,
			unit: 'km',
			displayValue: formatCombined(thisYearDistance, overall, 'km'),
			url: (await client.getAirtrailUrl()) || '',
			tooltip: yearPlusAllTooltip('Distance', thisYearDistance, overall, (v) => `${formatInteger(v)} km`)
		};
	}
);