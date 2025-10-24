import { ValueState } from '../../../../../../../lib/types/valueState';
import { createWidgetEndpoint } from '$lib/server/StandardWidgetDataEndpoint';
import GiteaClient, { type GiteaRunner } from '../../../GiteaClient';
import type { FillDataWidgetValue } from '$lib/types/DataWidgetValueTypes';

export const GET = createWidgetEndpoint(
	'gitea/admin/runners/busy',
	async (): Promise<FillDataWidgetValue> => {
		const giteaClient = new GiteaClient();
		const runners = await giteaClient.getAllRunners();

		let idleRunners = 0;
		let busyRunners = 0;
		runners.forEach((runner: GiteaRunner) => {
			if (runner.busy) {
				busyRunners++;
			} else {
				idleRunners++;
			}
		});

		let text = `${busyRunners} busy, ${idleRunners} idle`;
		if (busyRunners === 0 && idleRunners > 0) {
			text = `${idleRunners} runner${idleRunners === 1 ? '' : 's'} idle`;
		} else if (busyRunners > 0 && idleRunners === 0) {
			text = `${busyRunners} runner${busyRunners === 1 ? '' : 's'} busy`;
		} else if (runners.length === 0) {
			text = 'No runners found';
		}

		let valueState = ValueState.Error;
		if (busyRunners > 0) {
			valueState = ValueState.Warning;
		} else if (idleRunners > 0) {
			valueState = ValueState.Success;
		}

		return {
			value: runners.length,
			classification: valueState,
			unit: '',
			displayValue: text,
			min: 0,
			max: runners.length,
			url: (await giteaClient.getGiteaUrl()) || '',
			tooltip: `Total runners: ${runners.length} (Busy: ${busyRunners}, Idle: ${idleRunners})`
		};
	}
);
