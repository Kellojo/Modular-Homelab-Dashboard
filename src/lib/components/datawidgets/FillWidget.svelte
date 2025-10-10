<script lang="ts">
	import type { DataWidgetValue } from '../../../routes/api/plugins/system/+server';
	import { ValueState } from '../../../routes/api/types/valueState';
	import DataWidget from '../DataWidget.svelte';
	import { getProperty } from 'dot-prop';

	let props = $props();
	let fill = $state(0);
	let subtitle = $state(props.subtitle || '-');
	let classification = $state(ValueState.Unknown);

	async function pullData(datasource: string, datapoint: string) {
		console.log(`Pulling data from ${datasource} for ${datapoint}`);
		const response = await fetch(`/api/plugins/${datasource}?datapoint=${datapoint}`);
		const data = await response.json();

		const dataPoint: DataWidgetValue = getProperty(data, datapoint);
		const value = dataPoint.value as number;
		fill = value;
		subtitle = props.subtitle || dataPoint.displayValue;
		classification = dataPoint.classification || ValueState.Unknown;
	}
</script>

{#snippet content()}
	<div class={['fill', classification]} style="--fill-level: {fill}%"></div>
{/snippet}

<DataWidget {...props} {subtitle} refreshData={pullData} {content}></DataWidget>

<style>
	.fill {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		top: calc(100% - var(--fill-level, 0));
		background-color: transparent;
		transition: top 0.2s ease-in;
	}

	.success {
		background-color: var(--successSecondary);
	}
	.warning {
		background-color: var(--warningSecondary);
	}
	.error {
		background-color: var(--errorSecondary);
	}
</style>
