import { formatInteger } from '$lib/server/Formatter';
import { createPassThroughHistoryEndpoint } from '$lib/server/PassThroughWidgetDataEndpoint';
import type { DataWidgetResponse, FillDataWidgetValue } from '$lib/types/DataWidgetValueTypes';
import { ValueState } from '$lib/types/valueState';
import { PiholeClient } from '../PiholeClient';

export const GET = createPassThroughHistoryEndpoint('pihole/forwarded', async () => {
    const piholeClient = new PiholeClient();
    const stats = await piholeClient.getHistory();

    const current = stats.history.reduce((res, entry) => res + entry.forwarded, 0);

    const response: DataWidgetResponse<FillDataWidgetValue> = {
        current: {
            displayValue: formatInteger(current),
            value: current,
            classification: ValueState.Success,
            unit: ''
        },
        history: stats.history.map((entry) => ({
            timestamp: new Date(entry.timestamp * 1000),
            value: {
                displayValue: formatInteger(entry.forwarded),
                value: entry.forwarded,
                classification: ValueState.Success,
                unit: ''
            }
        }))
    };

    return response;
});
