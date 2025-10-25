import { createWidgetEndpoint } from '$lib/server/StandardWidgetDataEndpoint';
import type { FillDataWidgetValue, ListDataWidgetValue } from '$lib/types/DataWidgetValueTypes';
import { ValueState } from '$lib/types/valueState';
import type { Systeminformation } from 'systeminformation';
import DockerClient from '../DockerClient';

export const GET = createWidgetEndpoint('docker/images', async (): Promise<ListDataWidgetValue> => {
	const dockerClient = new DockerClient();
	const images = await dockerClient.getImages();

	const items: FillDataWidgetValue[] = [];

	images.forEach((image) => {
		let tooltip = '';
		items.push({
			displayValue: image.repoTags ? image.repoTags.join(', ') : '<none>',
			value: 1,
			classification: getImageStateClassification(image),
			tooltip: tooltip,
			unit: ''
		});
	});

	const classificationOrder = [
		ValueState.Error,
		ValueState.Warning,
		ValueState.Success,
		ValueState.Unknown
	];
	items.sort((a, b) => {
		const classAIndex = classificationOrder.indexOf(a.classification);
		const classBIndex = classificationOrder.indexOf(b.classification);
		if (classAIndex !== classBIndex) {
			return classAIndex - classBIndex;
		}
		return a.displayValue.localeCompare(b.displayValue);
	});

	const imagesSize = await dockerClient.getOverallImageSize();
	let displayValue = `${images.length} available (${imagesSize})`;
	if (images.length === 0) {
		displayValue = 'No Images found';
	}

	return {
		displayValue: displayValue,
		items: items
	};
});

function getImageStateClassification(image: Systeminformation.DockerImageData): ValueState {
	if (image.container === undefined) return ValueState.Error;
	return ValueState.Success;
}
