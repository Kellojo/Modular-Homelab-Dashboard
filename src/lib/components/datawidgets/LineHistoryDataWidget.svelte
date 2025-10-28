<script lang="ts">
	import type { GradientColor } from '$lib/types/Gradient';
	import type Gradient from '$lib/types/Gradient';
	import type {
		DataWidgetResponse,
		FillDataWidgetValue,
		DataWidgetResponseHistoryPoint
	} from '../../types/DataWidgetValueTypes';
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

		// Create defs container for gradients
		svg.append('defs');

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

		path = svg
			.append('path')
			.attr('fill', 'none')
			.attr('stroke', 'url(#line-gradient)')
			.attr('stroke-width', 2);
	});

	const maxPointCount = 64;

	function applyResults(data: DataWidgetResponse<FillDataWidgetValue>) {
		subtitle = props.subtitle || data.current.displayValue;
		const consideredHistory = data.history.slice(-maxPointCount + 1);

		// Update gradient from backend data if available
		let gradientData: Gradient | undefined = data.current.gradient;
		if (gradientData == undefined) {
			gradientData = {
				horizontal: true,
				colors: [
					{ stop: 0, color: 'var(--successSecondary)' },
					{ stop: 100, color: 'var(--success)' }
				]
			};
		}

		const defs = svg.select('defs');

		// Remove existing gradient
		defs.select('#line-gradient').remove();

		const g = defs
			.append('linearGradient')
			.attr('id', 'line-gradient')
			.attr('gradientUnits', 'userSpaceOnUse');
		if (gradientData.horizontal) {
			g.attr('x1', 0).attr('y1', 0).attr('x2', chartWidth).attr('y2', 0);
		} else {
			g.attr('x1', 0).attr('y1', 0).attr('x2', 0).attr('y2', chartHeight);
		}
		gradientData.colors.forEach((color: GradientColor) => {
			g.append('stop').attr('offset', `${color.stop}%`).attr('stop-color', color.color);
		});

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
