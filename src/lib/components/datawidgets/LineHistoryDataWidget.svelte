<script lang="ts">
	import { ValueState } from '$lib/types/valueState';
	import type { DataWidgetResponse, FillDataWidgetValue, DataWidgetResponseHistoryPoint } from '../../types/DataWidgetValueTypes';
	import DataWidget from '../DataWidget.svelte';
	import * as d3 from 'd3';
	import { onMount } from 'svelte';

	let props = $props();
	let subtitle = $state(props.subtitle || '-');

	let chart: SVGSVGElement;
	let svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
	let path: d3.Selection<SVGPathElement, unknown, null, undefined>;
	let curveFunc: d3.Line<DataWidgetResponseHistoryPoint<FillDataWidgetValue>>;
	let chartWidth = 0;
	let chartHeight = 0;

	onMount(() => {
		svg = d3.select(chart).attr('width', chartWidth).attr('height', chartHeight);

		// Create gradient definition
		const defs = svg.append('defs');
		const gradient = defs
			.append('linearGradient')
			.attr('id', 'line-gradient')
			.attr('x1', '0%')
			.attr('y1', '0%')
			.attr('x2', '100%')
			.attr('y2', '0%');
		
		gradient
			.append('stop')
			.attr('offset', '0%')
			.attr('stop-color', 'var(--successSecondary)');
		
		gradient
			.append('stop')
			.attr('offset', '100%')
			.attr('stop-color', 'var(--success)');

		curveFunc = d3
			.line<DataWidgetResponseHistoryPoint<FillDataWidgetValue>>()
			.curve(d3.curveBasis)
			.x((d, i) => {
				return i * (chartWidth / (maxPointCount - 1));
			})
			.y((d) => {
				const min = d.value.min || 0;
				const max = d.value.max || 100;
				const range = max - min;
				const value = typeof d.value.value === 'number' ? d.value.value : 0;
				const scaledY = ((value - min) / range) * chartHeight;
				const y = chartHeight - scaledY;
				return y;
			});

		path = svg.append('path').attr('fill', 'none').attr('stroke', 'url(#line-gradient)').attr('stroke-width', 2);
	});

	const maxPointCount = 64;

	function applyResults(data: DataWidgetResponse<FillDataWidgetValue>) {
		subtitle = props.subtitle || data.current.displayValue;
		const consideredHistory = data.history.slice(-maxPointCount + 1);

		path.attr('d', curveFunc(consideredHistory));
	}
</script>

{#snippet content()}
	<svg bind:clientWidth={chartWidth} bind:clientHeight={chartHeight} bind:this={chart}></svg>
{/snippet}

<DataWidget {...props} {subtitle} {applyResults} {content}></DataWidget>

<style>
	svg {
		max-height: 100%;
		max-width: 100%;
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
	}
</style>
