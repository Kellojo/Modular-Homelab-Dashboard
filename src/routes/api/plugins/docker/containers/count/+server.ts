import { createWidgetEndpoint } from '$lib/server/StandardWidgetDataEndpoint';
import type { FillDataWidgetValue } from '$lib/types/DataWidgetValueTypes';
import { ValueState } from '$lib/types/valueState';
import DockerClient from '../../DockerClient';

export const GET = createWidgetEndpoint(
	'docker/containers/count',
	async (): Promise<FillDataWidgetValue> => {
		const dockerClient = new DockerClient();

		const containerCount = await dockerClient.getContainerCount();

		return {
			value: containerCount,
			classification: ValueState.Success,
			unit: 'containers',
			displayValue: `${containerCount}`,
			tooltip: `${new Date().toLocaleString()}: ${containerCount} containers`
		};
	}
);
