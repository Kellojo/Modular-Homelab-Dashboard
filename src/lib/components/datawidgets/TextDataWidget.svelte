<script lang="ts">
	import type {
		DataWidgetValue,
		TextDataWidgetValue
	} from '../../../routes/api/plugins/system/+server';
	import { ValueState } from '../../types/valueState';
	import DataWidget from '../DataWidget.svelte';
	import { getProperty } from 'dot-prop';

	let props = $props();
	let subtitle = $state(props.subtitle || '-');
	let classification = $state(ValueState.Unknown);

	async function applyResults(data: TextDataWidgetValue) {
		subtitle = props.subtitle || data.displayValue;
		classification = data.classification || ValueState.Unknown;
	}
</script>

<DataWidget {...props} {subtitle} {applyResults}></DataWidget>
