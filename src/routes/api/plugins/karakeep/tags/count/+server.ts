import { formatInteger } from '$lib/common/Formatter';
import { createWidgetEndpoint } from '$lib/server/StandardWidgetDataEndpoint';
import type { FillDataWidgetValue } from '$lib/types/DataWidgetValueTypes';
import { ValueState } from '$lib/types/valueState';
import KarakeepApiClient from '../../KarakeepApiClient';

export const GET = createWidgetEndpoint(
    'karakeep/tags/count',
    async (): Promise<FillDataWidgetValue> => {
        const karakeepApiClient = new KarakeepApiClient();

        const tags = await karakeepApiClient.getAllTags();
        const count = tags.length;
        const displayValue = `${formatInteger(count)} tag${count !== 1 ? 's' : ''}`;

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
