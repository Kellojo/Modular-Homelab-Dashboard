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
	class:clickable={!!url}
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
		border: 1px solid var(--borderColor);
		border-radius: 1rem;

		background-color: var(--background);
		backdrop-filter: blur(2rem);
		padding: 1rem;
		box-shadow: var(--shadow-s);

		cursor: default;

		position: relative;
		overflow: hidden;

		display: flex;
		flex-direction: column;
		gap: 0.25rem;

		transition: border-color 0.1s ease-out;
	}

	.clickable {
		cursor: pointer;
	}
	.clickable:hover {
		border-color: var(--borderHoverColor);
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
			border-radius: 0.5rem;
			opacity: 0.9;
		}
	}

	h3 {
		color: var(--primaryText);
		font-size: 1rem;
		margin: 0;
		word-break: break-all;
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

	.content {
		flex-grow: 1;
		display: flex;
		align-items: end;
		z-index: 1;
	}

	* {
		z-index: 2;
	}
</style>
