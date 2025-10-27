<script lang="ts">
	import { formatTime } from '$lib/common/Formatter';
	import type { FillDataWidgetValue } from '$lib/types/DataWidgetValueTypes';

	let {
		minValue = 0,
		maxValue = 100,
		maxHeight = '100%',
		entries = $bindable([] as { timestamp: Date; value: FillDataWidgetValue }[])
	} = $props();
</script>

<div class="barchart">
	{#each entries as entry, i}
		<div class="entry">
			<div
				style="height: {(((entry.value.value as number) - minValue) / (maxValue - minValue)) *
					100}%; max-height: {maxHeight};"
				class={['bar', entry.value.classification]}
				title={entry.value.tooltip}
			></div>

			<div class="bar-label">
				{#if i % 10 === 0}{formatTime(entry.timestamp)}{/if}
			</div>
		</div>
	{/each}
</div>

<style>
	.barchart {
		display: flex;
		flex-direction: row;
		gap: 2px;
		overflow: hidden;
		justify-content: flex-end;
		align-items: flex-end;
		height: 100%;
	}

	.entry {
		width: 0.375rem;
		flex-shrink: 0;
		height: 100%;

		display: flex;
		flex-direction: column;
		justify-content: flex-end;
	}

	.bar {
		height: 100%;
		border-radius: 0.25rem;
		transition: height 0.2s ease-in;
		position: relative;
	}

	.bar-label {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 1rem;
		font-size: 0.625rem;
		color: var(--secondaryText);
		flex-shrink: 0;
		transform: translateY(2px);

		opacity: 0;
		transition: opacity 0.1s ease-in;
	}

	.barchart:hover .bar-label {
		opacity: 1;
	}

	.success {
		background-image: linear-gradient(0deg, var(--successSecondary), var(--success));
	}
	.warning {
		background-image: linear-gradient(0deg, var(--warningSecondary), var(--warning));
	}
	.error {
		background-image: linear-gradient(0deg, var(--errorSecondary), var(--error));
	}
</style>
