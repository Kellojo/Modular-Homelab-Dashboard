<script lang="ts">
	import { formatTime } from '$lib/common/Formatter';
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
		{#each history as entry, i}
			<div class="historyEntryContainer">
				<div
					style="height: {(((entry.value.value as number) - minValue) / (maxValue - minValue)) *
						100}%;"
					class={['historyEntry', entry.value.classification]}
					title={entry.value.tooltip}
				></div>

				<div class="bar-label">
					{#if i % 10 === 0}{formatTime(entry.timestamp)}{/if}
				</div>
			</div>
		{/each}
	</div>
{/snippet}

<DataWidget {...props} disableBottomPadding={true} {subtitle} {applyResults} {content}></DataWidget>

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

	.historyEntryContainer {
		width: 0.375rem;
		flex-shrink: 0;
		height: 100%;

		display: flex;
		flex-direction: column;
		justify-content: flex-end;
	}

	.historyEntry {
		height: 100%;
		border-radius: 0.25rem;
		transition: height 0.2s ease-in;
		position: relative;
	}

	.bar-label {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 1rem;
		font-size: 0.625rem;
		color: var(--secondaryText);
		flex-shrink: 0;
		transform: translateY(2px);

		opacity: 0;
		transition: opacity 0.1s ease-in;
	}

	.history:hover .bar-label {
		opacity: 1;
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
