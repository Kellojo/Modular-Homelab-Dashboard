import { formatInteger } from '$lib/common/Formatter';
import { createWidgetEndpoint } from '$lib/server/StandardWidgetDataEndpoint';
import type { FillDataWidgetValue } from '$lib/types/DataWidgetValueTypes';
import { ValueState } from '$lib/types/valueState';
import AirtrailClient from '../../AirtrailClient';
import { aggregateForCurrentYear, formatCombined, yearPlusAllTooltip } from '../../helpers';

export const GET = createWidgetEndpoint(
	'airtrail/flights/count',
	async (): Promise<FillDataWidgetValue> => {
		const client = new AirtrailClient();
		const flights = await client.getAllFlights();
		const { thisYear, overall } = aggregateForCurrentYear(flights);

		return {
			value: thisYear,
			classification: overall > 0 ? ValueState.Success : ValueState.Unknown,
			unit: 'Flights',
			displayValue: formatCombined(thisYear, overall, thisYear === 1 ? 'flight' : 'flights'),
			url: (await client.getAirtrailUrl()) || '',
			tooltip: yearPlusAllTooltip('Flights', thisYear, overall, (v) => formatInteger(v))
		};
	}
);