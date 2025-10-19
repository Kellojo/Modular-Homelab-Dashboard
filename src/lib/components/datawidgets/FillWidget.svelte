<script lang="ts">
	import type { DataWidgetResponse, FillDataWidgetValue } from '../../types/DataWidgetValueTypes';
	import { ValueState } from '../../types/valueState';
	import DataWidget from '../DataWidget.svelte';

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
	<div class={['fill', classification]} style="--fill-level: {fill}%"></div>
{/snippet}

<DataWidget {...props} {subtitle} {applyResults} {content}></DataWidget>

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
		background-image: linear-gradient(0deg, var(--successSecondary), var(--success));
	}
	.warning {
		background-image: linear-gradient(0deg, var(--warningSecondary), var(--warning));
	}
	.error {
		background-image: linear-gradient(0deg, var(--errorSecondary), var(--error));
	}
</style>
