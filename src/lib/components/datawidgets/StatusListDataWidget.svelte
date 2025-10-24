<script lang="ts">
	import type {
		DataWidgetResponse,
		FillDataWidgetValue,
		ListDataWidgetValue
	} from '../../types/DataWidgetValueTypes';
	import DataWidget from '../DataWidget.svelte';
	import StatusIndicator from '../generic/StatusIndicator.svelte';

	let props = $props();
	let list = $state<FillDataWidgetValue[]>([]);

	function applyResults(data: DataWidgetResponse<ListDataWidgetValue>) {
		list = data.current.items;
	}
</script>

{#snippet content()}
	<div class="list">
		{#each list as item}
			<div class={['listItem', item.classification]} title={item.tooltip}>
				<StatusIndicator classification={item.classification} />
				<span class="label">{item.displayValue}</span>
			</div>
		{/each}
	</div>
{/snippet}

<DataWidget {...props} {applyResults} {content} enableContentScrolling={true}></DataWidget>

<style>
	.list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		width: 100%;
		margin-bottom: auto;
	}

	.listItem {
		height: 1.25rem;
		background-color: var(--backgroundLight);
		padding: 0.25rem 0.5rem;
		border-radius: 1rem;

		display: flex;
		align-items: center;
		justify-content: flex-start;
		gap: 0.5rem;
	}

	.label {
		color: var(--secondaryText);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
