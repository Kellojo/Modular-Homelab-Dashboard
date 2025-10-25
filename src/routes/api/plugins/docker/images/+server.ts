import { createWidgetEndpoint } from '$lib/server/StandardWidgetDataEndpoint';
import type { FillDataWidgetValue, ListDataWidgetValue } from '$lib/types/DataWidgetValueTypes';
import { ValueState } from '$lib/types/valueState';
import type { Systeminformation } from 'systeminformation';
import DockerClient from '../DockerClient';
import { formatTimeAgo } from '$lib/server/Formatter';
import { filesize } from 'filesize';

export const GET = createWidgetEndpoint('docker/images', async (): Promise<ListDataWidgetValue> => {
	const dockerClient = new DockerClient();
	const images = await dockerClient.getImages();

	const items: FillDataWidgetValue[] = [];

	images.forEach((image) => {
		let tooltip = `Created ${formatTimeAgo(new Date(image.created * 1000))} - ${filesize(image.size)}`;

		let imageName = 'N/A';
		if (image.repoTags && image.repoTags.length > 0) {
			imageName = image.repoTags.join(', ');
		}

		items.push({
			displayValue: imageName,
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
	if (!image.container) return ValueState.Error;
	return ValueState.Success;
}
