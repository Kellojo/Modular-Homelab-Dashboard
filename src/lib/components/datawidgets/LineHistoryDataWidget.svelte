<script lang="ts">
	import { DefaultGradient, type GradientColor } from '$lib/types/Gradient';
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
			.attr('stroke-width', 2)
			.attr('mask', 'url(#fade-mask)');
	});

	const maxPointCount = 64;

	function applyResults(data: DataWidgetResponse<FillDataWidgetValue>) {
		subtitle = props.subtitle || data.current.displayValue;
		const consideredHistory = data.history.slice(-maxPointCount + 1);

		// Update gradient from backend data if available
		let gradientData: Gradient | undefined = data.current.gradient;
		if (gradientData == undefined) {
			gradientData = DefaultGradient;
		}

		const defs = svg.select('defs');

		// Remove existing gradients
		defs.select('#line-gradient').remove();
		defs.select('#opacity-gradient').remove();

		// Create the color gradient
		const colorGradient = defs
			.append('linearGradient')
			.attr('id', 'color-gradient')
			.attr('gradientUnits', 'userSpaceOnUse');
		if (gradientData.horizontal) {
			colorGradient.attr('x1', 0).attr('y1', 0).attr('x2', chartWidth).attr('y2', 0);
		} else {
			colorGradient.attr('x1', 0).attr('y1', 0).attr('x2', 0).attr('y2', chartHeight);
		}
		gradientData.colors.forEach((color: GradientColor) => {
			colorGradient.append('stop').attr('offset', `${color.stop}%`).attr('stop-color', color.color);
		});

		// Create the opacity gradient (fade from line start to end)
		const dataPointCount = consideredHistory.length;
		const lineStartX = dataPointCount > 1 ? 0 : chartWidth / 2; // Start at 0 if we have multiple points
		const lineEndX = dataPointCount > 1 ? (dataPointCount - 1) * (chartWidth / (maxPointCount - 1)) : chartWidth / 2;
		
		const opacityGradient = defs
			.append('linearGradient')
			.attr('id', 'opacity-gradient')
			.attr('gradientUnits', 'userSpaceOnUse')
			.attr('x1', lineStartX)
			.attr('y1', 0)
			.attr('x2', lineEndX)
			.attr('y2', 0);

		opacityGradient
			.append('stop')
			.attr('offset', '0%')
			.attr('stop-color', 'white')
			.attr('stop-opacity', 0.1);
		opacityGradient
			.append('stop')
			.attr('offset', '100%')
			.attr('stop-color', 'white')
			.attr('stop-opacity', 1);

		// Create a mask that follows the line's actual span
		const mask = defs.append('mask').attr('id', 'fade-mask');

		mask
			.append('rect')
			.attr('x', 0)
			.attr('y', 0)
			.attr('width', chartWidth)
			.attr('height', chartHeight)
			.attr('fill', 'url(#opacity-gradient)');

		// Create the final gradient that will be used by the path
		const finalGradient = defs
			.append('linearGradient')
			.attr('id', 'line-gradient')
			.attr('gradientUnits', 'userSpaceOnUse');
		if (gradientData.horizontal) {
			finalGradient.attr('x1', 0).attr('y1', 0).attr('x2', chartWidth).attr('y2', 0);
		} else {
			finalGradient.attr('x1', 0).attr('y1', 0).attr('x2', 0).attr('y2', chartHeight);
		}
		gradientData.colors.forEach((color: GradientColor) => {
			finalGradient.append('stop').attr('offset', `${color.stop}%`).attr('stop-color', color.color);
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
