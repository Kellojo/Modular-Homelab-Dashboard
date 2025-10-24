import { createWidgetEndpoint } from '$lib/server/StandardWidgetDataEndpoint';
import type { FillDataWidgetValue, ListDataWidgetValue } from '$lib/types/DataWidgetValueTypes';
import { ValueState } from '$lib/types/valueState';
import DockerClient, { DockerContainerState } from '../DockerClient';

export const GET = createWidgetEndpoint(
	'docker/containers',
	async (): Promise<ListDataWidgetValue> => {
		const dockerClient = new DockerClient();
		const containers = await dockerClient.getContainers();

		const items: FillDataWidgetValue[] = [];

		containers.forEach((container) => {
			const startedAt = new Date(container.startedAt);
			const tooltip = `Container started at ${startedAt.toLocaleString()} with image ${container.image}`;

			items.push({
				displayValue: container.name,
				value: 1,
				classification: getContainerStateClassification(container.state),
				tooltip: tooltip,
				unit: ''
			});
		});

		const classificationOrder = [ValueState.Success, ValueState.Warning, ValueState.Unknown];
		items.sort((a, b) => {
			const classAIndex = classificationOrder.indexOf(a.classification);
			const classBIndex = classificationOrder.indexOf(b.classification);
			if (classAIndex !== classBIndex) {
				return classAIndex - classBIndex;
			}
			return a.displayValue.localeCompare(b.displayValue);
		});

		return {
			items: items
		};
	}
);

function getContainerStateClassification(state: string): ValueState {
	if (state === DockerContainerState.Running) return ValueState.Success;
	if (state === DockerContainerState.Exited) return ValueState.Warning;
	if (state === DockerContainerState.Created) return ValueState.Warning;
	return ValueState.Unknown;
}
