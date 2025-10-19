<script lang="ts">
	import type { DataWidgetResponse, FillDataWidgetValue } from '../../types/DataWidgetValueTypes';
	import DataWidget from '../DataWidget.svelte';

	let props = $props();
	let subtitle = $state(props.subtitle || '-');
	let history = $state([] as { timestamp: Date; value: FillDataWidgetValue }[]);
	let minValue = $state(0);
	let maxValue = $state(0);

	function applyResults(data: DataWidgetResponse<FillDataWidgetValue>) {
		subtitle = props.subtitle || data.current.displayValue;
		history = data.history;

		if (props.minValue !== undefined) {
			minValue = props.minValue || 0;
		} else {
			//minValue = Math.min(...history.map((entry) => entry.value.value as number));
		}

		if (props.maxValue !== undefined) {
			maxValue = props.maxValue;
		} else {
			maxValue = Math.max(...history.map((entry) => entry.value.value as number));
		}
	}
</script>

{#snippet content()}
	<div class="history">
		{#each history as entry}
			<div
				style="height: {(((entry.value.value as number) - minValue) / (maxValue - minValue)) *
					100}%;"
				class={['historyEntry', entry.value.classification]}
				title={`${new Date(entry.timestamp).toLocaleTimeString()}: ${entry.value.displayValue}`}
			></div>
		{/each}
	</div>
{/snippet}

<DataWidget {...props} {subtitle} {applyResults} {content}></DataWidget>

<style>
	.history {
		display: flex;
		flex-direction: row;
		gap: 2px;
		overflow: hidden;
		justify-content: flex-end;
		align-items: flex-end;
		height: 100%;
	}

	.historyEntry {
		min-width: 0.375rem;
		height: 100%;
		border-radius: 0.25rem;
	}

	.success {
		background-image: linear-gradient(0deg, var(--successSecondary), var(--success));
	}
	.warning {
		background-image: linear-gradient(0deg, var(--warningSecondary), var(--warning));
	}
	.error {
		background-image: linear-gradient(0deg, var(--errorSecondary), var(--error));
	}
</style>
