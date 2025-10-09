<script>
	import Widget from '$lib/components/Widget.svelte';
	import WidgetGrid from '$lib/components/WidgetGrid.svelte';
	import WidgetTitle from '$lib/components/WidgetTitle.svelte';
</script>

<div class="page">
	<div class="header"></div>

	<WidgetGrid>
		<WidgetTitle title="System Info" />

		<Widget title="CPU" subtitle="5%" />
		<Widget title="Widget 2" subtitle="This is widget 2" width={2} height={2} />
		<Widget title="Widget 3" subtitle="This is widget 3" />
		<Widget title="Widget 4" subtitle="This is widget 4" />
		<Widget title="Widget 5" subtitle="This is widget 5" />
		<Widget title="Widget 6" subtitle="This is widget 6" />
		<Widget title="Widget 6" subtitle="This is widget 6" />
		<Widget title="Widget 6" subtitle="This is widget 6" />
		<Widget title="Widget 1" subtitle="This is widget 1" />
		<Widget title="Widget 2" subtitle="This is widget 2" />
		<Widget title="Widget 3" subtitle="This is widget 3" />
		<Widget title="Widget 4" subtitle="This is widget 4" />
		<Widget title="Widget 5" subtitle="This is widget 5" />
		<Widget title="Widget 6" subtitle="This is widget 6" />
		<Widget title="Widget 6" subtitle="This is widget 6" />
		<Widget title="Widget 6" subtitle="This is widget 6" />
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
