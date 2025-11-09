<script lang="ts">
	import type { DataWidgetResponse, FillDataWidgetValue } from '../../types/DataWidgetValueTypes';
	import DataWidget from '../DataWidget.svelte';
	import BarChart from '../generic/BarChart.svelte';
	import Heatmap from '../generic/Heatmap.svelte';

	let props = $props();
	let subtitle = $state(props.subtitle || '-');
	let history = $state([] as { timestamp: Date; value: FillDataWidgetValue }[]);

	function applyResults(data: DataWidgetResponse<FillDataWidgetValue>) {
		subtitle = props.subtitle || data.current.displayValue;
		history = data.history;
	}
</script>

{#snippet content()}
	<div>
		<Heatmap entries={history} />
	</div>
{/snippet}

<DataWidget {...props} {subtitle} disableBottomPadding={true} {applyResults} {content} />

<style>
	div {
		display: flex;
		justify-content: end;
		overflow: hidden;
	}
</style>
