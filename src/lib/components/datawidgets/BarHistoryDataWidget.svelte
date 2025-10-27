<script lang="ts">
	import { formatTime } from '$lib/common/Formatter';
	import type { DataWidgetResponse, FillDataWidgetValue } from '../../types/DataWidgetValueTypes';
	import DataWidget from '../DataWidget.svelte';
	import BarChart from '../generic/BarChart.svelte';

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
		}

		if (props.maxValue !== undefined) {
			maxValue = props.maxValue;
		} else {
			maxValue = Math.max(...history.map((entry) => entry.value.value as number));
		}
	}
</script>

{#snippet content()}
	<BarChart {minValue} {maxValue} bind:entries={history} />
{/snippet}

<DataWidget {...props} disableBottomPadding={true} {subtitle} {applyResults} {content}></DataWidget>
