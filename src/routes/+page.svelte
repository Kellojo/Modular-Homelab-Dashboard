<script lang="ts">
	import LinkWidget from '$lib/components/LinkWidget.svelte';
	import WidgetGrid from '$lib/components/WidgetGrid.svelte';
	import WidgetTitle from '$lib/components/WidgetTitle.svelte';
	import FillWidget from '$lib/components/datawidgets/FillWidget.svelte';
	import StatusHistoryDataWidget from '$lib/components/datawidgets/StatusHistoryDataWidget.svelte';
	import TextDataWidget from '$lib/components/datawidgets/TextDataWidget.svelte';
	import type { WidgetData } from '../lib/server/Config.js';

	const { data } = $props();

	const components = {
		title: WidgetTitle,
		link: LinkWidget,
		datawidget: {
			text: TextDataWidget,
			fill: FillWidget,
			statushistory: StatusHistoryDataWidget
		}
	};

	function getComponent(widget: WidgetData) {
		if (widget.type === 'datawidget' && widget.subtype) {
			return components[widget.type][widget.subtype] || null;
		}
		return components[widget.type] || null;
	}
</script>

<div class="page">
	<div class="header"></div>

	<WidgetGrid>
		{#each data.widgets as widget}
			{#if getComponent(widget)}
				{@const Comp = getComponent(widget)}
				<Comp {...widget} />
			{:else}
				<p class="text-red-500">Unknown widget: {widget.type}</p>
			{/if}
		{/each}
	</WidgetGrid>
</div>

<style>
	.header {
		height: 2rem;
		margin-bottom: 1rem;
		padding: 1rem 0;
		width: 100%;

		display: flex;
		align-items: center;
	}

	.page {
		display: flex;
		flex-direction: column;
		align-items: start;

		padding: 0 2rem 2rem 2rem;
		margin: 0 auto;

		max-width: calc(8 * var(--cellSize) + 7 * var(--cellGap));
	}

	@media (max-width: 1200px) {
		.page {
			max-width: calc(6 * var(--cellSize) + 5 * var(--cellGap));
		}
	}
	@media (max-width: 909px) {
		.page {
			max-width: calc(4 * var(--cellSize) + 3 * var(--cellGap));
		}
	}
	@media (max-width: 624px) {
		.page {
			max-width: calc(3 * var(--cellSize) + 2 * var(--cellGap));
		}
	}
	@media (max-width: 480px) {
		.page {
			max-width: calc(2 * var(--cellSize) + 1 * var(--cellGap));
		}
	}
</style>
