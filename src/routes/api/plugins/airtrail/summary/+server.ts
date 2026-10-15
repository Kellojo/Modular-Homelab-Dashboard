import { createWidgetEndpoint } from '$lib/server/StandardWidgetDataEndpoint';
import type { TextDataWidgetValue } from '$lib/types/DataWidgetValueTypes';
import { ValueState } from '$lib/types/valueState';
import AirtrailClient from '../AirtrailClient';
import { aggregateForCurrentYear, estimateDistanceForYear, formatCombined } from '../helpers';

export const GET = createWidgetEndpoint(
	'airtrail/summary',
	async (): Promise<TextDataWidgetValue> => {
		const client = new AirtrailClient();
		const [stats, flights] = await Promise.all([client.getStats(), client.getAllFlights()]);

		const { thisYear: thisYearFlights, overall: overallFlights } = aggregateForCurrentYear(flights);
		const overallDistance = stats.distanceKm;
		const thisYearDistance = estimateDistanceForYear(thisYearFlights, overallFlights, overallDistance);

		const flightsText = formatCombined(thisYearFlights, overallFlights, 'flights');
		const distanceText = formatCombined(thisYearDistance, overallDistance, 'km');

		return {
			displayValue: `${flightsText}, ${distanceText}`,
			classification: overallFlights > 0 ? ValueState.Success : ValueState.Unknown,
			url: (await client.getAirtrailUrl()) || ''
		};
	}
);