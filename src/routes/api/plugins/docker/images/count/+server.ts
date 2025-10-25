import { createWidgetEndpoint } from '$lib/server/StandardWidgetDataEndpoint';
import type { FillDataWidgetValue } from '$lib/types/DataWidgetValueTypes';
import { ValueState } from '$lib/types/valueState';
import DockerClient from '../../DockerClient';

export const GET = createWidgetEndpoint(
	'docker/images/count',
	async (): Promise<FillDataWidgetValue> => {
		const dockerClient = new DockerClient();

		const imageCount = await dockerClient.getImageCount();

		return {
			value: imageCount,
			classification: ValueState.Success,
			unit: 'images',
			displayValue: `${imageCount}`,
			tooltip: `${new Date().toLocaleString()}: ${imageCount} images`
		};
	}
);
