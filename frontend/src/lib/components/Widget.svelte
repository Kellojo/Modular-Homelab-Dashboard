<script lang="ts">
	const MAX_WIDTH = 2;
	const MAX_HEIGHT = 3;
	let { title = '', subtitle = '', width = 1, height = 1 } = $props();

	width = Math.min(width, MAX_WIDTH);
	width = Math.max(width, 1);
	height = Math.min(height, MAX_HEIGHT);
	height = Math.max(height, 1);
</script>

<div class="widget" style="grid-column: span {width}; grid-row: span {height};">
	<h3>{title}</h3>
	<p>{subtitle}</p>
</div>

<style>
	.widget {
		border: 2px solid var(--borderColor);
		border-radius: 1rem;

		background-color: var(--background);
		padding: 1rem;

		cursor: pointer;
	}

	h3 {
		color: var(--primaryText);
		font-size: 1rem;
		margin: 0;

		margin-bottom: 0.25rem;
	}

	p {
		color: var(--secondaryText);
		font-size: 0.875rem;
		margin: 0;
	}

	h3,
	p {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}
</style>
