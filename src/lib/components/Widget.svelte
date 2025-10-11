<script lang="ts">
	import type { Snippet } from 'svelte';

	let { title = '', subtitle = '', width = 1, height = 1, content, url = '', icon } = $props();

	const MAX_WIDTH = 2;
	const MAX_HEIGHT = 3;
	width = Math.min(width, MAX_WIDTH);
	width = Math.max(width, 1);
	height = Math.min(height, MAX_HEIGHT);
	height = Math.max(height, 1);

	function onclick() {
		if (url) {
			window.open(url, '_blank', 'noopener,noreferrer');
		}
	}
</script>

<div
	class="widget"
	style="grid-column: span {width}; grid-row: span {height};"
	{onclick}
	onkeydown={(e) => e.key === 'Enter' && onclick()}
	role="button"
	tabindex={url ? 0 : -1}
>
	{#if title}
		<div class="title">
			{#if icon}
				<img src={icon} alt="Icon" />
			{/if}
			<h3>{title}</h3>
		</div>
	{/if}

	{#if subtitle}
		<p>{subtitle}</p>
	{/if}

	{#if content}
		<div class="content">{@render content()}</div>
	{/if}
</div>

<style>
	.widget {
		border: 2px solid var(--borderColor);
		border-radius: 1rem;

		background-color: var(--background);
		padding: 1rem;

		cursor: pointer;

		position: relative;
		overflow: hidden;

		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.title {
		display: inline;
		gap: 0.5rem;

		display: flex;
		flex-direction: row;
		align-items: center;

		img {
			max-width: 2rem;
			max-height: 2rem;
		}
	}

	h3 {
		color: var(--primaryText);
		font-size: 1rem;
		margin: 0;
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

		text-shadow: 0 0 2px var(--backgroundTextContrastShadow);

		position: relative;
	}

	* {
		z-index: 1;
	}
</style>
