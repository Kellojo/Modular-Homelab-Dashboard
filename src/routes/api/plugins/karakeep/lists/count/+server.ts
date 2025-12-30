import { formatInteger } from '$lib/common/Formatter';
import { createWidgetEndpoint } from '$lib/server/StandardWidgetDataEndpoint';
import type { FillDataWidgetValue } from '$lib/types/DataWidgetValueTypes';
import { ValueState } from '$lib/types/valueState';
import KarakeepApiClient from '../../KarakeepApiClient';

export const GET = createWidgetEndpoint(
	'karakeep/lists/count',
	async (): Promise<FillDataWidgetValue> => {
		const karakeepApiClient = new KarakeepApiClient();

		const lists = await karakeepApiClient.getAllLists();
		const count = lists.length;
		const displayValue = `${formatInteger(count)} list${count !== 1 ? 's' : ''}`;

		return {
			value: count,
			classification: ValueState.Success,
			unit: '',
			displayValue: displayValue,
			url: (await karakeepApiClient.getKarakeepUrl()) || '',
			tooltip: displayValue
		};
	}
);
