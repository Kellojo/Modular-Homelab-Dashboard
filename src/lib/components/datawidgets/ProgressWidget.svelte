<script lang="ts">
	import type { DataWidgetResponse, FillDataWidgetValue } from '../../types/DataWidgetValueTypes';
	import { ValueState } from '../../types/valueState';
	import DataWidget from '../DataWidget.svelte';
	import Progressbar from '../generic/Progressbar.svelte';

	let props = $props();
	let fill = $state(0);
	let subtitle = $state(props.subtitle || '-');
	let classification = $state(ValueState.Unknown);

	function applyResults(data: DataWidgetResponse<FillDataWidgetValue>) {
		const current = data.current;
		subtitle = props.subtitle || current.displayValue;
		classification = current.classification || ValueState.Unknown;

		const value = current.value as number;
		const min = current.min || 0;
		const max = current.max || 100;
		fill = Math.min(Math.max(((value - min) / (max - min)) * 100, 0), 100);
	}
</script>

{#snippet content()}
	<Progressbar {fill} {classification} title={subtitle} />
{/snippet}

<DataWidget {...props} {subtitle} {applyResults} {content}></DataWidget>
