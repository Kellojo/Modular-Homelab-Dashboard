<script lang="ts">
	import type { DataWidgetResponse, TextDataWidgetValue } from '$lib/types/DataWidgetValueTypes';
	import { ValueState } from '../../types/valueState';
	import DataWidget from '../DataWidget.svelte';

	let props = $props();
	let subtitle = $state(props.subtitle || '-');
	let classification = $state(ValueState.Unknown);

	async function applyResults(data: DataWidgetResponse<TextDataWidgetValue>) {
		subtitle = props.subtitle || data.current.displayValue;
		classification = data.current.classification || ValueState.Unknown;
	}
</script>

<DataWidget {...props} {subtitle} {applyResults}></DataWidget>
