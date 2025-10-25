import { formatTimeAgo } from '$lib/server/Formatter';
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
			let tooltip = '';
			if (container.state === DockerContainerState.Running) {
				tooltip = `Container started ${formatTimeAgo(new Date(container.startedAt))}`;
			} else if (container.state === DockerContainerState.Exited) {
				tooltip = `Container exited ${formatTimeAgo(new Date(container.finishedAt))}`;
			} else if (container.state === DockerContainerState.Created) {
				tooltip = `Container created ${formatTimeAgo(new Date(container.createdAt))}`;
			}

			tooltip += `\nImage: ${container.image}`;
			items.push({
				displayValue: container.name,
				value: 1,
				classification: getContainerStateClassification(container.state),
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

		let displayValue = `${containers.length} available`;
		if (containers.length === 0) {
			displayValue = 'No Containers found';
		}

		return {
			displayValue: displayValue,
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
