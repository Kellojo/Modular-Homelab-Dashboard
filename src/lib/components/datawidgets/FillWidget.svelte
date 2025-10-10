<script lang="ts">
	import type { FillDataWidgetValue } from '../../../routes/api/types/DataWidgetValueTypes';
	import { ValueState } from '../../../routes/api/types/valueState';
	import DataWidget from '../DataWidget.svelte';
	import { getProperty } from 'dot-prop';

	let props = $props();
	let fill = $state(0);
	let subtitle = $state(props.subtitle || '-');
	let classification = $state(ValueState.Unknown);

	function applyResults(data: FillDataWidgetValue) {
		subtitle = props.subtitle || data.displayValue;
		classification = data.classification || ValueState.Unknown;

		const value = data.value as number;
		const min = data.min || 0;
		const max = data.max || 100;
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
		background-color: var(--successSecondary);
	}
	.warning {
		background-color: var(--warningSecondary);
	}
	.error {
		background-color: var(--errorSecondary);
	}
</style>
