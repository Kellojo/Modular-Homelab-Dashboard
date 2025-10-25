import { createWidgetEndpoint } from '$lib/server/StandardWidgetDataEndpoint';
import type { FillDataWidgetValue } from '$lib/types/DataWidgetValueTypes';
import { ValueState } from '$lib/types/valueState';
import DockerClient from '../../DockerClient';

export const GET = createWidgetEndpoint(
	'docker/images/size',
	async (): Promise<FillDataWidgetValue> => {
		const dockerClient = new DockerClient();

		const imageSize = await dockerClient.getOverallImageSize();

		return {
			value: imageSize,
			classification: ValueState.Success,
			unit: '',
			displayValue: `${imageSize}`,
			tooltip: `${new Date().toLocaleString()}: ${imageSize}`
		};
	}
);
