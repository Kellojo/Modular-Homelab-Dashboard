<script lang="ts">
	import type { DataWidgetResponse, FillDataWidgetValue } from '../../types/DataWidgetValueTypes';
	import DataWidget from '../DataWidget.svelte';

	let props = $props();
	let subtitle = $state(props.subtitle || '-');
	let history = $state([] as { timestamp: Date; value: FillDataWidgetValue }[]);

	function applyResults(data: DataWidgetResponse<FillDataWidgetValue>) {
		subtitle = props.subtitle || data.current.displayValue;
		history = data.history;
	}
</script>

{#snippet content()}
	<div class="history">
		{#each history as entry}
			<div
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
	}

	.historyEntry {
		min-width: 0.375rem;
		height: 1rem;
		border-radius: 0.25rem;
	}

	.success {
		background-color: var(--success);
	}
	.warning {
		background-color: var(--warning);
	}
	.error {
		background-color: var(--error);
	}
</style>
