<script lang="ts">
	import { areOnSameDay } from '$lib/common/Date';
	import type { FillDataWidgetValue } from '$lib/types/DataWidgetValueTypes';

	let {
		entries = $bindable([] as { timestamp: Date; value: FillDataWidgetValue }[]),
		min = 0,
		max = 5
	} = $props();

	const today = new Date();

	let weeks: Week[] = $derived.by(() => {
		const calculatedWeeks: Week[] = [];

		for (let i = 0; i < 53; i++) {
			let week: Day[] = [];
			for (let j = 0; j < 7; j++) {
				const date = new Date();
				date.setDate(today.getDate() - (i * 7 + j));
				const entry = entries.find((e) => areOnSameDay(e.timestamp, date));
				week.push({ date, value: entry ? entry.value : null });
			}
			week = week.reverse();
			calculatedWeeks.push({
				days: week,
				monthLabel:
					week[0].date.getDate() <= 7
						? week[0].date.toLocaleString('default', { month: 'short' })
						: undefined
			});
		}

		return calculatedWeeks.reverse();
	});

	function formatValueTooltip(value: FillDataWidgetValue | null, date: Date): string {
		if (value) {
			return `${value.displayValue} on ${date.toDateString()}`;
		} else {
			return `No data on ${date.toDateString()}`;
		}
	}

	interface Day {
		date: Date;
		value: FillDataWidgetValue | null;
	}
	interface Week {
		days: Day[];
		monthLabel?: string;
	}
</script>

<div class="heatmap">
	<div class="grid">
		{#each weeks as week}
			<div class="week">
				{#each week.days as day}
					<div
						class={['day', day.value?.classification]}
						style={`opacity: ${(day.value?.value as number) / max};`}
						title={formatValueTooltip(day.value, day.date)}
					></div>
				{/each}
			</div>
		{/each}
	</div>

	<div class="month-labels">
		{#each weeks as week, weekIndex}
			<div class="month-label">
				{week.monthLabel}
			</div>
		{/each}
	</div>
</div>

<style>
	.grid {
		display: flex;
		flex-direction: row;
		gap: 1px;
	}

	.week {
		display: flex;
		flex-direction: column;
		gap: 1px;
	}

	.day {
		width: 5px;
		height: 5px;
		background-color: var(--backgroundLight);
		border-radius: 1px;

		transition:
			background-color 0.2s ease-in,
			opacity 0.2s ease-in;
	}

	.success {
		background-color: var(--success);
	}

	.warning {
		background-color: var(--warning);
	}

	.error {
		background-color: var(--error);
	}

	.information {
		background-color: var(--information);
	}

	.month-labels {
		display: flex;
		flex-direction: row;
		gap: 1px;
		opacity: 0;
		transition: opacity 0.1s ease-in;
	}

	.month-label {
		font-size: 0.625rem;
		color: var(--secondaryText);
		text-align: center;
		width: 5px;
		margin-top: 0.25rem;
	}

	:hover {
		.month-labels {
			opacity: 1;
		}
	}
</style>
