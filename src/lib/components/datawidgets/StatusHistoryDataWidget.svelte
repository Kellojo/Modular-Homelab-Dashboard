<script lang="ts">
	import type { DataWidgetResponse, FillDataWidgetValue } from '../../types/DataWidgetValueTypes';
	import DataWidget from '../DataWidget.svelte';
	import BarChart from '../generic/BarChart.svelte';

	let props = $props();
	let subtitle = $state(props.subtitle || '-');
	let history = $state([] as { timestamp: Date; value: FillDataWidgetValue }[]);

	function applyResults(data: DataWidgetResponse<FillDataWidgetValue>) {
		subtitle = props.subtitle || data.current.displayValue;
		history = data.history;
	}
</script>

{#snippet content()}
	<BarChart minValue={0} maxValue={1} maxHeight={'2rem'} bind:entries={history} />
{/snippet}

<DataWidget {...props} disableBottomPadding={true} {subtitle} {applyResults} {content}></DataWidget>
